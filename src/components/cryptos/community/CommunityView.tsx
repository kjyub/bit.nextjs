import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import CommunityPagination from '@/components/atomics/community/CommunityPagination';
import { MARKET_COMMUNITY_COMMENT_PAGE_SIZE } from '@/constants/CryptoConsts';
import { useUser } from '@/hooks/useUser';
import useToastMessageStore from '@/store/useToastMessageStore';
import * as CS from '@/styles/CryptoMarketCommunityStyles';
import { TextFormats } from '@/types/CommonTypes';
import Pagination from '@/types/api/pagination';
import { type LikeType, LikeTypes } from '@/types/common/CommonTypes';
import MarketCommunity from '@/types/cryptos/MarketCommunity';
import type MarketCommunityComment from '@/types/cryptos/MarketCommunityComment';
import type User from '@/types/users/User';
import CommonUtils from '@/utils/CommonUtils';
import { useEffect, useRef, useState } from 'react';
import CommunityComment from './CommunityComment';

interface ICryptoMarketCommunityView {
  user: User;
  communityNanoId: string;
}
export default function CryptoMarketCommunityView({ user, communityNanoId }: ICryptoMarketCommunityView) {
  const { createMessage } = useToastMessageStore();
  const { isAuth } = useUser();

  const [community, setCommunity] = useState<MarketCommunity>(new MarketCommunity());

  const [myLikeType, setMyLikeType] = useState<LikeType>(LikeTypes.NONE);
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);

  // 댓글
  const [commentValue, setCommentValue] = useState<string>('');
  const [comments, setComments] = useState<Array<MarketCommunityComment>>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [itemCount, setItemCount] = useState<number>(0);
  const [isCommentLoading, setCommentLoading] = useState<boolean>(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // 댓글 데이터 정리
  useEffect(() => {
    setComments([]);
    setItemCount(0);
    setPageIndex(1);
    setCommentLoading(false);

    if (communityNanoId) {
      getCommunity(communityNanoId);
      getComments(-1);
    } else {
      setCommunity(new MarketCommunity());
    }
  }, [communityNanoId]);

  const getCommunity = async (nanoId: string) => {
    const response = await CryptoApi.getCommunityDetail(nanoId);
    setCommunity(response);
    setLikes(response.likes);
    setDislikes(response.dislikes);
    setMyLikeType(response.likeType);
  };

  // 댓글 목록 가져오기
  const getComments = async (_pageIndex: number, requireId = 0) => {
    let response = new Pagination<MarketCommunityComment>();
    response = await CryptoApi.getCommunityCommentList(communityNanoId, _pageIndex, MARKET_COMMUNITY_COMMENT_PAGE_SIZE);

    // 결과에 있어야할 필수 댓글이 있는지 확인 (대댓글 관련 로직)
    const hasRequireComment = (): boolean => {
      return response.items.filter((c) => c.id === requireId).length > 0;
    };

    if (requireId && !hasRequireComment()) {
      let additionalIndex = 0;

      // 서버 과부하를 막기 위한 10번 제한
      while (additionalIndex < 10) {
        additionalIndex += 1;
        response = await CryptoApi.getCommunityCommentList(
          community.nanoId,
          _pageIndex + additionalIndex,
          MARKET_COMMUNITY_COMMENT_PAGE_SIZE,
        );

        if (hasRequireComment()) {
          break;
        }
      }
    }

    setComments(response.items);
    setItemCount(response.count);
    setPageIndex(response.pageIndex);

    // 댓글 수 업데이트
    const commentCountElement = document.getElementById(`comments-${community.nanoId}`);
    if (commentCountElement) {
      commentCountElement.innerText = response.count.toString();
    }
  };

  // 댓글 및 대댓글 작성
  const handleComment = async (value: string, parentId = 0) => {
    if (isCommentLoading) {
      return;
    }

    if (!isAuth) {
      createMessage('로그인 후 이용해주세요.');
      return;
    }

    if (!user.uuid) {
      createMessage('회원 정보를 찾을 수 없습니다.');
      return;
    }

    setCommentLoading(true);

    const data: {
      community_nano_id: string;
      content: string;
      parent_id?: number;
    } = {
      community_nano_id: community.nanoId,
      content: value,
    };

    if (parentId) {
      data.parent_id = parentId;
    }

    const result = await CryptoApi.createCommunityComment(data);

    if (result.id < 0) {
      setCommentLoading(false);
      createMessage('작성 실패했습니다.');
      return;
    }

    setCommentValue('');
    if (!parentId && commentInputRef.current) {
      commentInputRef.current.style.height = '48px';
    }

    if (parentId) {
      // 대댓글인 경우 해당 페이지에서 댓글을 다시 불러옴
      await getComments(pageIndex, result.id);
    } else {
      await getComments(-1);
    }
    setCommentLoading(false);
  };

  const handleCommentEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleComment(commentValue);
    }
  };

  const handleLike = async (_type: LikeType) => {
    if (!user.uuid) {
      createMessage('로그인 후 이용 가능합니다.');
      return;
    }

    // 이미 추천이 된 경우는 취소
    if (myLikeType !== LikeTypes.NONE && myLikeType !== _type) {
      createMessage('추천 취소 후 다시 시도해주세요.');
      return;
    }

    let type: LikeType = LikeTypes.NONE;
    if (myLikeType === LikeTypes.NONE && _type !== myLikeType) {
      type = _type;
    }
    const result = await CryptoApi.likeCommunity(community.nanoId, type);

    if (!result) {
      createMessage('추천 실패했습니다.');
      return;
    }

    setMyLikeType(type);
    if (type === LikeTypes.LIKE) {
      setLikes(likes + 1);
    } else if (type === LikeTypes.DISLIKE) {
      setDislikes(dislikes + 1);
    } else {
      if (myLikeType === LikeTypes.LIKE) {
        setLikes(likes - 1);
      } else if (myLikeType === LikeTypes.DISLIKE) {
        setDislikes(dislikes - 1);
      }
    }
  };

  if (!community.nanoId) {
    return;
  }

  return (
    <CS.ItemViewBox>
      {/* 내용 */}
      <pre className="text-slate-300 leading-6 font-pretendard w-full">{community.content}</pre>

      {/* 추천 */}
      <CS.ItemViewLikeBox>
        <button
          className={`like ${myLikeType === LikeTypes.LIKE ? 'active' : ''}`}
          type="button"
          onClick={() => {
            handleLike(LikeTypes.LIKE);
          }}
        >
          <i className="fa-solid fa-thumbs-up"></i>
          <span>추천 {likes}</span>
        </button>
        <button
          className={`dislike ${myLikeType === LikeTypes.DISLIKE ? 'active' : ''}`}
          type="button"
          onClick={() => {
            handleLike(LikeTypes.DISLIKE);
          }}
        >
          <i className="fa-solid fa-thumbs-down"></i>
          <span>비추천 {dislikes}</span>
        </button>
      </CS.ItemViewLikeBox>

      {/* 댓글 */}
      <CS.ItemCommentLayout>
        <span className="comment-count">{CommonUtils.textFormat(itemCount, TextFormats.NUMBER)}개의 댓글</span>
        <div className="list">
          {comments.map((comment, index) => (
            <CommunityComment key={index} user={user} comment={comment} handleComment={handleComment} />
          ))}
        </div>

        <div className="pagination">
          <CommunityPagination
            page={pageIndex}
            setPage={async (v) => {
              getComments(v);
            }}
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
            onChange={(e) => {
              setCommentValue(e.target.value);
            }}
            onKeyDown={handleCommentEnter}
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = '48px';
              target.style.height = `${Number(target.scrollHeight)}px`;
            }}
          />
          <button
            type="button"
            onClick={() => {
              handleComment(commentValue);
            }}
          >
            작성
          </button>
        </CS.ItemCommentWriteBox>
      </CS.ItemCommentLayout>
    </CS.ItemViewBox>
  );
}
