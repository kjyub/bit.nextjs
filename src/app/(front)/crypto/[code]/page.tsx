import CryptoServerApi from '@/apis/api/cryptos/CryptoServerApi';
import TradeGoServerApi from '@/apis/api/cryptos/TradeGoServerApi';
import CryptoMarketCommunity from '@/components/cryptos/community/Community';
import CryptoMarketMain from '@/components/cryptos/market/MarketMain';
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
  console.log('CryptoMarketPage');
  const awaitParams = await params;
  const { code } = awaitParams;
  const awaitSearchParams = await searchParams;

  console.log('code', code);
  console.log(process.env.NEXT_PUBLIC_DJANGO_SERVER, process.env.NEXT_PUBLIC_TRADE_SERVER);

  const marketData = await CryptoServerApi.getMarket(code);
  console.log('marketData', marketData);
  // const marketCurrent = await TradeGoServerApi.getMarketCurrent(code);
  // console.log('marketCurrent', marketCurrent);


  return (
    <CryptoMarketMain
      marketCode={code}
      marketData={marketData}
      // marketCurrent={marketCurrent}
      communityNode={<CryptoMarketCommunityPage params={awaitParams} searchParams={awaitSearchParams} />}
    />
  );
}
