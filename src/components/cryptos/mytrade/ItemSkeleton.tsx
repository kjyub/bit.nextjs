interface ICryptoMyTradeItemSkeleton {
  ref: React.RefObject<HTMLDivElement>;
  pageIndex: number;
  itemCount: number;
  pageSize: number;
}
export default function CryptoMyTradeItemSkeleton({ ref, pageIndex, itemCount, pageSize }: ICryptoMyTradeItemSkeleton) {
  const isShow = pageIndex * pageSize < itemCount;

  return (
    <div
      ref={ref}
      className="flex flex-col w-full space-y-2 [&>div]:w-full [&>div]:h-24 [&>div]:rounded-lg [&>div]:animate-pulse"
    >
      {isShow && (
        <>
          <div className="bg-surface-common-background" />
          <div className="bg-surface-common-background" />
          <div className="bg-surface-common-background" />
        </>
      )}
    </div>
  );
}
