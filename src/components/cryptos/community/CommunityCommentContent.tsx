import * as CS from '@/styles/CryptoMarketCommunityStyles';
import { useEffect, useRef, useState } from 'react';

interface ICommentContent {
  content: string;
  hasParent: boolean;
  parentName: string;
  isEdit: boolean;
  handleComment: (value: string) => void;
}
// 댓글 내용 및 수정 컴포넌트
export default function CommunityCommentContent({ content, hasParent, parentName, isEdit, handleComment }: ICommentContent) {
  // 댓글
  const [_isShowReply, setShowReply] = useState<boolean>(false);
  const [commentValue, setCommentValue] = useState<string>(content);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCommentValue(content);
  }, [isEdit]);

  // 댓글 수정
  const handleCommentEdit = () => {
    handleComment(commentValue);
    setCommentValue('');
    if (commentInputRef.current) {
      commentInputRef.current.style.height = '48px';
    }
    setShowReply(false);
  };

  const handleCommentEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleCommentEdit();
    }
  };

  return (
    <>
      {isEdit ? (
        <CS.ItemCommentWriteBox className="mt-2 [&>button]:w-24">
          <textarea
            ref={commentInputRef}
            value={commentValue}
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
              handleCommentEdit();
            }}
          >
            수정
          </button>
        </CS.ItemCommentWriteBox>
      ) : (
        <pre className="content font-pretendard">
          {/* {hasParent && (
            <div className="h-fit mt-1 mr-1 px-1 py-0.5 -translate-y-0.5 rounded-sm bg-[#edfcf1] text-brand_green-4 text-xs font-light">
              {parentName}
            </div>
          )} */}
          {content}
        </pre>
      )}
    </>
  );
};
