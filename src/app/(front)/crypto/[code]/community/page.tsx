import CryptoMarketCommunity from '@/components/cryptos/community/CryptoMarketCommunity';
import { Suspense } from 'react';
import CryptoMarketCommunityPage from '../community';
import { IMarketPageSearchParams } from '../page';
import CryptoMarketInfo from '@/components/cryptos/market/CryptoMarketInfo';
import CryptoServerApi from '@/apis/api/cryptos/CryptoServerApi';
import TradeGoServerApi from '@/apis/api/cryptos/TradeGoServerApi';

interface Props {
  params: Promise<{ code: string }>;
  searchParams: Promise<IMarketPageSearchParams>;
}
export default async function Page({ params, searchParams }: Props) {
  const awaitParams = await params;
  const awaitSearchParams = await searchParams;
  const { code } = awaitParams;

  const marketData = await CryptoServerApi.getMarket(code);
  const marketCurrent = await TradeGoServerApi.getMarketCurrent(code);

  return (
    <div className="max-md:w-full md:w-156 p-4">
      <CryptoMarketInfo marketCode={code} marketData={marketData} marketCurrent={marketCurrent} />
      <CryptoMarketCommunityPage params={awaitParams} searchParams={awaitSearchParams} />
    </div>
  );
}
