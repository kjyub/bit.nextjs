import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import { useUser } from '@/hooks/useUser';
import useSystemMessageStore from '@/store/useSystemMessageStore';
import useToastMessageStore from '@/store/useToastMessageStore';
import * as CS from '@/styles/CryptoMarketCommunityStyles';
import type MarketCommunityComment from '@/types/cryptos/MarketCommunityComment';
import type User from '@/types/users/User';
import { UserTypes } from '@/types/users/UserTypes';
import DateUtils from '@/utils/DateUtils';
import { useEffect, useRef, useState } from 'react';
import CommunityCommentContent from './CommunityCommentContent';

interface IComment {
  user: User;
  comment: MarketCommunityComment;
  handleComment: (value: string, parentId: number) => void;
}
export default function CommunityComment({ user, comment, handleComment }: IComment) {
  const createToastMessage = useToastMessageStore((state) => state.createMessage);
  const createSystemMessage = useSystemMessageStore((state) => state.createMessage);

  const [content, setContent] = useState<string>(comment.content);

  const { isAuth } = useUser();

  // 댓글 수정
  const [isShowEdit, setShowEdit] = useState<boolean>(false);
  const [isEditLoading, setEditLoading] = useState<boolean>(false);

  // 댓글 삭제
  const [isDeleted, setDeleted] = useState<boolean>(false);

  // 대댓글
  const [isShowReply, setShowReply] = useState<boolean>(false);
  const [commentValue, setCommentValue] = useState<string>('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const hasParent = !!comment.parentId;
  const isMaster = user.uuid === comment.user.uuid || user.userType === UserTypes.STAFF;

  useEffect(() => {
    setContent(comment.content);
  }, [comment]);

  // 댓글 수정
  const handleCommentEdit = async (value: string) => {
    if (isEditLoading) {
      return;
    }

    if (!isAuth) {
      createToastMessage('로그인 후 이용해주세요.');
      return;
    }

    if (!user.uuid) {
      createToastMessage('회원 정보를 찾을 수 없습니다.');
      return;
    }

    setEditLoading(true);

    const data = {
      content: value,
    };

    const result = await CryptoApi.updateCommunityComment(comment.id, data);

    if (result.id < 0) {
      setEditLoading(false);
      createToastMessage('수정 실패했습니다.');
      return;
    }
    setContent(result.content);
    setShowEdit(false);
    setEditLoading(false);
  };

  // 대댓글 작성
  const handleCommentReply = () => {
    if (!isAuth) {
      createToastMessage('로그인 후 이용해주세요.');
      return;
    }

    handleComment(commentValue, comment.id);
    setCommentValue('');
    if (commentInputRef.current) {
      commentInputRef.current.style.height = '48px';
    }
    setShowReply(false);
  };

  const handleCommentEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleCommentReply();
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async () => {
    const isConfirmed = await createSystemMessage({
      type: 'confirm',
      content: '정말 삭제하시겠습니까?',
    });

    if (!isConfirmed) {
      return;
    }

    const response = await CryptoApi.deleteCommunityComment(comment.id);

    if (response) {
      setDeleted(true);
      createToastMessage('삭제되었습니다');
    } else {
      createToastMessage('삭제에 실패했습니다.');
    }
  };

  return (
    <CS.ItemCommentBox className={`${hasParent ? 'ml-4 w-[calc(100%-1rem)]' : ''}`} $is_deleted={isDeleted}>
      <div className="header">
        <div className="user">
          <i className="fa-solid fa-user" />
          <span>{comment.user.nickname}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="max-md:text-[11px] md:text-xs text-surface-sub-text">
            {DateUtils.getDateShorten(comment.createdDate)}
          </span>
          <CS.ItemControlButton
            $is_active={isShowReply}
            onClick={() => {
              setShowReply(!isShowReply);
            }}
          >
            <i className="fa-solid fa-reply"></i>
          </CS.ItemControlButton>
          {isMaster && (
            <>
              <CS.ItemControlButton
                $is_active={isShowEdit}
                onClick={() => {
                  setShowEdit(!isShowEdit);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </CS.ItemControlButton>
              <CS.ItemControlButton
                onClick={() => {
                  handleCommentDelete();
                }}
              >
                <i className="fa-solid fa-trash"></i>
              </CS.ItemControlButton>
            </>
          )}
        </div>
      </div>

      {/* 댓글 내용과 댓글 수정은 여기서 진행된다. */}
      <CommunityCommentContent
        content={content}
        hasParent={hasParent}
        parentName={'parentName'}
        isEdit={isShowEdit}
        handleComment={handleCommentEdit}
      />

      {/* 답글 작성 */}
      {isShowReply && (
        <CS.ItemCommentWriteBox className="mt-2 pl-6 [&>button]:w-24">
          <textarea
            ref={commentInputRef}
            value={commentValue}
            placeholder="답글을 입력해주세요"
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
              handleCommentReply();
            }}
          >
            등록
          </button>
        </CS.ItemCommentWriteBox>
      )}
    </CS.ItemCommentBox>
  );
}
