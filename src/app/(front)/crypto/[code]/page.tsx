import CryptoServerApi from '@/apis/api/cryptos/CryptoServerApi';
import TradeGoServerApi from '@/apis/api/cryptos/TradeGoServerApi';
import CryptoMarketMain from '@/components/cryptos/CryptoMarketMain';
import CryptoMarketCommunity from '@/components/cryptos/community/CryptoMarketCommunity';
import { Suspense } from 'react';
import CryptoMarketCommunityPage from './community';

export interface IMarketPageSearchParams {
  search: string;
  page: number;
}

interface IMarketPage {
  params: Promise<{ code: string }>;
  searchParams: Promise<IMarketPageSearchParams>;
}
export default async function CryptoMarketPage({ params, searchParams }: IMarketPage) {
  const awaitParams = await params;
  const { code } = awaitParams;
  const awaitSearchParams = await searchParams;

  const marketData = await CryptoServerApi.getMarket(code);
  const marketCurrent = await TradeGoServerApi.getMarketCurrent(code);

  return (
    <CryptoMarketMain
      marketCode={code}
      marketData={marketData}
      marketCurrent={marketCurrent}
      communityNode={
        <Suspense fallback={<CryptoMarketCommunity params={{}} communityListData={{}} />}>
          <CryptoMarketCommunityPage params={awaitParams} searchParams={awaitSearchParams} />
        </Suspense>
      }
    />
  );
}
