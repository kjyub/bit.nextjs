import * as S from "@/styles/CryptoMarketStyles"
import * as CS from "@/styles/CryptoMarketCommunityStyles"
import Pagination from "@/types/api/pagination"
import MarketCommunity from "@/types/cryptos/MarketCommunity"
import CommunitySearch from "../../atomics/community/CommunitySearch"
import CommonUtils from "@/utils/CommonUtils"
import CryptoApi from "@/apis/api/cryptos/CryptoApi"
import MarketCommunityComment from "@/types/cryptos/MarketCommunityComment"
import { useEffect, useRef, useState } from "react"
import User from "@/types/users/User"
import { TextFormats } from "@/types/CommonTypes"
import CommunityPagination from "@/components/atomics/community/CommunityPagination"
import { LikeTypeValues, LikeTypes } from "@/types/common/CommonTypes"
import { MARKET_COMMUNITY_COMMENT_PAGE_SIZE } from "@/constants/CryptoConsts"
import { UserTypes } from "@/types/users/UserTypes"

interface ICryptoMarketCommunityView {
    user: User
    communityNanoId: string
}
export default function CryptoMarketCommunityView({ user, communityNanoId }: ICryptoMarketCommunityView) {
    const [community, setCommunity] = useState<MarketCommunity>(new MarketCommunity())

    const [myLikeType, setMyLikeType] = useState<LikeTypeValues>(LikeTypes.NONE)
    const [likes, setLikes] = useState<number>(0)
    const [dislikes, setDislikes] = useState<number>(0)

    // 댓글
    const [commentValue, setCommentValue] = useState<string>("")
    const [comments, setComments] = useState<Array<MarketCommunityComment>>([])
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [itemCount, setItemCount] = useState<number>(0)
    const [isCommentLoading, setCommentLoading] = useState<boolean>(false)
    const commentInputRef = useRef<HTMLTextAreaElement>(null)

    // 댓글 데이터 정리
    useEffect(() => {
        setComments([])
        setItemCount(0)
        setPageIndex(1)
        setCommentLoading(false)
        
        if (!CommonUtils.isStringNullOrEmpty(communityNanoId)) {
            getCommunity(communityNanoId)
            getComments(-1)
        } else {
            setCommunity(new MarketCommunity())
        }
    }, [communityNanoId])

    const getCommunity = async (nanoId: string) => {
        const response = await CryptoApi.getCommunityDetail(nanoId)
        setCommunity(response)
        setLikes(response.likes)
        setDislikes(response.dislikes)
        setMyLikeType(response.likeType)
    }

    // 댓글 목록 가져오기
    const getComments = async (_pageIndex: number, requireId: number = -1) => {
        let response = new Pagination<MarketCommunityComment>()
        response = await CryptoApi.getCommunityCommentList(communityNanoId, _pageIndex, MARKET_COMMUNITY_COMMENT_PAGE_SIZE)

        // 결과에 있어야할 필수 댓글이 있는지 확인 (대댓글 관련 로직)
        const hasRequireComment = (): boolean => {
            return response.items.filter((c) => c.id === requireId).length > 0
        }

        if (requireId >= 0 && !hasRequireComment()) {
            let additionalIndex = 0

            // 서버 과부하를 막기 위한 10번 제한
            while (additionalIndex < 10) {
                additionalIndex += 1
                response = await CryptoApi.getCommunityCommentList(community.nanoId, _pageIndex + additionalIndex, MARKET_COMMUNITY_COMMENT_PAGE_SIZE)

                if (hasRequireComment()) {
                    break
                }
            }
        }

        setComments(response.items)
        setItemCount(response.count)
        setPageIndex(response.pageIndex)

        // 댓글 수 업데이트
        const commentCountElement = document.getElementById(`comments-${community.nanoId}`)
        if (commentCountElement) {
            commentCountElement.innerText = response.count.toString()
        }
    }
 
    // 댓글 및 대댓글 작성
    const handleComment = async (value: string, parentId: number = -1) => {
        if (isCommentLoading) {
            return
        }
        if (CommonUtils.isStringNullOrEmpty(user.uuid)) {
            alert("회원 정보를 찾을 수 없습니다.")
            return
        }

        setCommentLoading(true)
        
        let data = {
            community_nano_id: community.nanoId,
            content: value,
        }

        if (parentId >= 0) {
            data["parent_id"] = parentId
        }

        const result = await CryptoApi.createCommunityComment(data)

        if (result.id < 0) {
            setCommentLoading(false)
            alert("작성 실패했습니다.")
            return
        }

        setCommentValue("")
        if (parentId < 0 && commentInputRef.current) {
            commentInputRef.current.style.height = "48px"
        }

        if (parentId >= 0) {
            // 대댓글인 경우 해당 페이지에서 댓글을 다시 불러옴
            await getComments(pageIndex, result.id)
        } else {
            await getComments(-1)
        }
        setCommentLoading(false)
    }

    const handleCommentEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleComment(commentValue)
        }
    }

    const handleLike = async (_type: LikeTypeValues) => {
        if (CommonUtils.isStringNullOrEmpty(user.uuid)) {
            alert("로그인 후 이용 가능합니다.")
            return
        }

        // 이미 추천이 된 경우는 취소
        let type = LikeTypes.NONE
        if (myLikeType === LikeTypes.NONE && _type !== myLikeType) {
            type = _type
        }
        const result = await CryptoApi.likeCommunity(community.nanoId, type)

        if (!result) {
            alert("추천 실패했습니다.")
            return
        }

        setMyLikeType(type)
        if (type === LikeTypes.LIKE) {
            setLikes(likes + 1)
        } else if (type === LikeTypes.DISLIKE) {
            setDislikes(dislikes + 1)
        } else {
            if (myLikeType === LikeTypes.LIKE) {
                setLikes(likes - 1)
            } else if (myLikeType === LikeTypes.DISLIKE) {
                setDislikes(dislikes - 1)
            }
        }
    }

    if (CommonUtils.isStringNullOrEmpty(community.nanoId)) {
        return
    }

    return (
        <CS.ItemViewBox>
            {/* 내용 */}
            <pre className="text-slate-300 leading-6 font-pretendard w-full">{community.content}</pre>

            {/* 추천 */}
            <CS.ItemViewLikeBox>
                <button 
                    className={`like ${myLikeType === LikeTypes.LIKE ? "active" : ""}`}
                    onClick={() => {handleLike(LikeTypes.LIKE)}}
                >
                    <i className="fa-solid fa-thumbs-up"></i>
                    <span>추천 {likes}</span>
                </button>
                <button 
                    className={`dislike ${myLikeType === LikeTypes.DISLIKE ? "active" : ""}`} 
                    onClick={() => {handleLike(LikeTypes.DISLIKE)}}
                >
                    <i className="fa-solid fa-thumbs-down"></i>
                    <span>비추천 {dislikes}</span>
                </button>
            </CS.ItemViewLikeBox>

            {/* 댓글 */}
            <CS.ItemCommentLayout>
                <span className="comment-count">
                    {CommonUtils.textFormat(itemCount, TextFormats.NUMBER)}개의 댓글
                </span>
                <div className="list">
                    {comments.map((comment, index) => (
                        <Comment 
                            key={index}
                            user={user}
                            comment={comment}
                            handleComment={handleComment}
                        />
                    ))}
                </div>
                
                <div className="pagination">
                    <CommunityPagination 
                        page={pageIndex}
                        setPage={async (v) => {getComments(v)}}
                        itemCount={itemCount}
                        pageSize={MARKET_COMMUNITY_COMMENT_PAGE_SIZE}
                        maxPageButtons={5}
                    />
                </div>

                <CS.ItemCommentWriteBox>
                    <textarea 
                        ref={commentInputRef}
                        value={commentValue}
                        placeholder="댓글을 입력해주세요"
                        onChange={(e)=>{setCommentValue(e.target.value)}}
                        onKeyDown={handleCommentEnter}
                        onInput={(e) => {
                            e.target.style.height = "48px"
                            e.target.style.height = (Number(e.target.scrollHeight)) + "px"
                        }}
                    />
                    <button onClick={() => {handleComment(commentValue)}}>
                        작성
                    </button>
                </CS.ItemCommentWriteBox>
            </CS.ItemCommentLayout>
        </CS.ItemViewBox>
    )
}


interface IComment {
    user: User
    comment: MarketCommunityComment
    handleComment: (value: string, parentId: number) => void
}
const Comment = ({ user, comment, handleComment }: IComment) => {
    const [content, setContent] = useState<string>(comment.content)

    // 댓글 수정
    const [isShowEdit, setShowEdit] = useState<boolean>(false)
    const [isEditLoading, setEditLoading] = useState<boolean>(false)

    // 댓글 삭제
    const [isDeleted, setDeleted] = useState<boolean>(false)

    // 대댓글
    const [isShowReply, setShowReply] = useState<boolean>(false)
    const [commentValue, setCommentValue] = useState<string>("")
    const commentInputRef = useRef<HTMLTextAreaElement>(null)

    const hasParent = comment.parentId && comment.parentId >= 0
    const isMaster = user.uuid === comment.user.uuid || user.userType === UserTypes.STAFF

    useEffect(() => {
        setContent(comment.content)
    }, [comment])

    // 댓글 수정
    const handleCommentEdit = async (value: string) => {
        if (isEditLoading) {
            return
        }
        if (CommonUtils.isStringNullOrEmpty(user.uuid)) {
            alert("회원 정보를 찾을 수 없습니다.")
            return
        }

        setEditLoading(true)
        
        let data = {
            content: value,
        }

        const result = await CryptoApi.updateCommunityComment(comment.id, data)

        if (result.id < 0) {
            setEditLoading(false)
            alert("수정 실패했습니다.")
            return
        }
        setContent(result.content)
        setShowEdit(false)
        setEditLoading(false)
    }

    // 대댓글 작성
    const handleCommentReply = () => {
        handleComment(commentValue, comment.id)
        setCommentValue("")
        if (commentInputRef.current) {
            commentInputRef.current.style.height = "48px"
        }
        setShowReply(false)
    }

    const handleCommentEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleCommentReply()
        }
    }

    // 댓글 삭제
    const handleCommentDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) {
            return
        }

        const response = await CryptoApi.deleteCommunityComment(comment.id)

        if (response) {
            setDeleted(true)
            alert("삭제되었습니다")
        } else {
            alert("삭제에 실패했습니다.")
        }
    }

    return (
        <CS.ItemCommentBox className={`${hasParent ? "pl-6" : ""}`} $is_deleted={isDeleted}>
            <div className="header">
                <div className="user">
                    <i className="fa-solid fa-user" />
                    <span>{comment.user.nickname}</span>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">{CommonUtils.getDateShorten(comment.createdDate)}</span>
                    <CS.ItemControlButton onClick={() => {setShowReply(!isShowReply)}}>
                        <i className="fa-solid fa-reply"></i>
                    </CS.ItemControlButton>
                    {isMaster && (
                        <>
                            <CS.ItemControlButton onClick={() => {setShowEdit(!isShowEdit)}}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </CS.ItemControlButton>
                            <CS.ItemControlButton onClick={() => {handleCommentDelete()}}>
                                <i className="fa-solid fa-trash"></i>
                            </CS.ItemControlButton>
                        </>
                    )}
                </div>
            </div>

            {/* 댓글 내용과 댓글 수정은 여기서 진행된다. */}
            <CommentContent 
                content={content}
                hasParent={hasParent}
                parentName={comment.parentName}
                isEdit={isShowEdit}
                handleComment={handleCommentEdit}
            />

            {/* 답글 작성 */}
            {isShowReply && (
                <CS.ItemCommentWriteBox className="mt-4! pl-6 [&>button]:w-24">
                    <textarea
                        ref={commentInputRef}
                        type={"text"}
                        value={commentValue}
                        placeholder="답글을 입력해주세요"
                        onChange={(e)=>{setCommentValue(e.target.value)}}
                        onKeyDown={handleCommentEnter}
                        onInput={(e) => {
                            e.target.style.height = "48px"
                            e.target.style.height = (Number(e.target.scrollHeight)) + "px"
                        }}
                    />
                    <button onClick={() => {handleCommentReply()}}>
                        등록
                    </button>
                </CS.ItemCommentWriteBox>
            )}
        </CS.ItemCommentBox>
    )
}

interface ICommentContent {
    content: string
    hasParent: boolean
    parentName: string
    isEdit: boolean
    handleComment: (value: string) => void
}
// 댓글 내용 및 수정 컴포넌트
const CommentContent = ({ content, hasParent, parentName, isEdit, handleComment }: ICommentContent) => {
    // 댓글
    const [isShowReply, setShowReply] = useState<boolean>(false)
    const [commentValue, setCommentValue] = useState<string>(content)
    const commentInputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setCommentValue(content)
    }, [isEdit])

    // 댓글 수정
    const handleCommentEdit = () => {
        handleComment(commentValue)
        setCommentValue("")
        if (commentInputRef.current) {
            commentInputRef.current.style.height = "48px"
        }
        setShowReply(false)
    }

    const handleCommentEnter = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            handleCommentEdit()
        }
    }

    return (
        <>
            {isEdit ? (
                <CS.ItemCommentWriteBox className="mt-4! [&>button]:w-24">
                    <textarea
                        ref={commentInputRef}
                        type={"text"}
                        value={commentValue}
                        onChange={(e)=>{setCommentValue(e.target.value)}}
                        onKeyDown={handleCommentEnter}
                        onInput={(e) => {
                            e.target.style.height = "48px"
                            e.target.style.height = (Number(e.target.scrollHeight)) + "px"
                        }}
                    />
                    <button onClick={() => {handleCommentEdit()}}>
                        수정
                    </button>
                </CS.ItemCommentWriteBox>
            ) : (
                <pre className="content font-pretendard">
                    {hasParent && (
                        <div className="h-fit mt-1 mr-1 px-1 py-0.5 -translate-y-0.5 rounded-sm bg-[#edfcf1] text-brand_green-4 text-xs font-light">
                            {parentName}
                        </div>
                    )}
                    {content}
                </pre>
            )}
        </>
    )
}