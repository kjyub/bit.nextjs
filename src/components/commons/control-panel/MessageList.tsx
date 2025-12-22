'use client';

import UserApi from '@/apis/api/users/UserApi';
import usePageScroll from '@/hooks/usePageScroll';
import { useUser } from '@/hooks/useUser';
import UserMessage from '@/types/users/UserMessage';
import DateUtils from '@/utils/DateUtils';
import { cn } from '@/utils/StyleUtils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10;

interface Props {
  ref?: React.RefObject<HTMLDivElement>;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}
export default function MessageList({ ref, className, isOpen, onClose }: Props) {
  const { isAuth } = useUser();
  const [messages, setMessages] = useState<Array<UserMessage>>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [itemCount, setItemCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(isAuth);

  useEffect(() => {
    if (!isAuth) {
      setLoading(false);
      return;
    }
    setLoading(true);

    if (isOpen) {
      getMessages(1);
    } else {
      setMessages([]);
      setPageIndex(1);
      setItemCount(1);
      setLoading(true);
    }
  }, [isAuth, isOpen]);

  const getMessages = async (_pageIndex: number) => {
    setLoading(true);

    const response = await UserApi.getMessages(_pageIndex, PAGE_SIZE);

    if (_pageIndex === 1) {
      setMessages(response.items);
    } else {
      setMessages([...messages, ...response.items]);
    }
    setPageIndex(response.pageIndex >= 0 ? response.pageIndex : _pageIndex);
    setItemCount(response.count);
    setLoading(false);
  };

  const handleNextPage = () => {
    if (isLoading) return;

    getMessages(pageIndex + 1);
  };

  const scrollRef = usePageScroll<HTMLDivElement>({
    nextPage: handleNextPage,
    pageIndex,
    itemCount,
    pageSize: PAGE_SIZE,
  });

  const handleRead = async (e: React.MouseEvent<HTMLButtonElement>, messageId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await UserApi.readMessages([messageId]);
    if (result) {
      setMessages(messages.filter((message) => message.id !== messageId));
    }
  };

  return (
    <div
      ref={ref}
      className={cn([
        'flex flex-col overflow-y-auto gap-2 rounded-lg',
        { 'pointer-events-none': messages.length === 0 },
        className,
      ])}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} onClose={onClose} handleRead={handleRead} />
      ))}

      {messages.length === 0 && !isLoading && <span className="m-auto text-surface-main-text/70">메세지가 없습니다.</span>}

      {messages.length === 0 && isLoading && (
        <div className="flex flex-col w-full gap-2 [&>a]:animate-pulse [&_*]:text-transparent">
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
        </div>
      )}

      <Skeletons ref={scrollRef} pageIndex={pageIndex} itemCount={itemCount} pageSize={PAGE_SIZE} />
    </div>
  );
}

const MessageItem = ({
  message,
  onClose,
  handleRead,
}: {
  message: UserMessage;
  onClose?: () => void;
  handleRead?: (e: React.MouseEvent<HTMLButtonElement>, messageId: number) => void;
}) => {
  return (
    <Link
      className="flex flex-col w-full p-4 gap-0.5 rounded-2xl bg-surface-sub-background hover:bg-surface-sub-background-active transition-colors"
      href={message.link}
      onClick={onClose}
    >
      <div className="flex justify-between w-full">
        <span className="text-xs text-surface-sub-text">{DateUtils.getDateShorten(message.createdDate)}</span>
        <button
          className="text-sm text-surface-sub-text hover:text-surface-main-text"
          type="button"
          onClick={(e) => handleRead?.(e, message.id)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="flex w-full">
        <span className="text-sm text-surface-main-text">{message.message}</span>
      </div>
    </Link>
  );
};

const dummyMessage = new UserMessage();
dummyMessage.parseResponse({
  id: 0,
  message: '메세지',
  createdDate: new Date(),
  link: '#',
});

interface SkeletonProps {
  ref: React.RefObject<HTMLDivElement>;
  pageIndex: number;
  itemCount: number;
  pageSize: number;
}
const Skeletons = ({ ref, pageIndex, itemCount, pageSize }: SkeletonProps) => {
  const isShow = pageIndex * pageSize < itemCount;

  return (
    <div ref={ref} className="flex flex-col w-full gap-2 [&>a]:animate-pulse [&_*]:text-transparent [&_*]:skeleton">
      {isShow && (
        <>
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
          <MessageItem message={dummyMessage} />
        </>
      )}
    </div>
  );
};
