import CryptoMarketCommunity from '@/components/cryptos/community/CryptoMarketCommunity';
import { Suspense } from 'react';
import CryptoMarketCommunityPage from '../community';
import { IMarketPageSearchParams } from '../page';

interface Props {
  params: Promise<{ code: string }>;
  searchParams: Promise<IMarketPageSearchParams>;
}
export default async function Page({ params, searchParams }: Props) {
  const awaitParams = await params;
  const awaitSearchParams = await searchParams;

  return (
    <div className="max-md:w-full md:w-128 p-4">
      <Suspense fallback={<CryptoMarketCommunity params={{}} communityListData={{}} />}>
        <CryptoMarketCommunityPage params={awaitParams} searchParams={awaitSearchParams} />
      </Suspense>
    </div>
  );
}
