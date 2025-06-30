import usePageScroll from '@/hooks/usePageScroll';
import { use } from 'react';
import { FlexContext } from '../FlexView';
import FlexItem, { FlexItemSkeleton } from './Item';

const PAGE_SIZE = 20;

export default function FlexList() {
  const { flexes, pageIndex, itemCount, isLoading, getNextPage } = use(FlexContext);

  const scrollRef = usePageScroll<HTMLDivElement>({
    nextPage: getNextPage,
    pageIndex: pageIndex,
    itemCount: itemCount,
    pageSize: PAGE_SIZE,
  });
  return (
    <div className="flex flex-col max-md:w-full md:w-128 gap-8">
      {isLoading && (
        <>
          <FlexItemSkeleton />
          <FlexItemSkeleton />
          <FlexItemSkeleton />
          <FlexItemSkeleton />
        </>
      )}
      {flexes.map((flex) => (
        <FlexItem key={flex.id} flex={flex} />
      ))}
      <FlexItemSkeleton ref={scrollRef} isShow={pageIndex * PAGE_SIZE < itemCount} />
    </div>
  );
}
