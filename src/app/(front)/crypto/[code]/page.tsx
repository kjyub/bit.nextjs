import CryptoServerApi from '@/apis/api/cryptos/CryptoServerApi';
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import CryptoMarketMain from '@/components/cryptos/market/MarketMain';
import CryptoMarketCommunityPage from './community';

export interface IMarketPageSearchParams {
  search: string;
  page: number;
}

export async function generateMetadata({ params }: IMarketPage) {
  const awaitParams = await params;
  const { code } = awaitParams;
  return {
    title: `${code}`,
  };
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
  const marketCurrent = await TradeGoApi.getMarketCurrent(code);

  return (
    <CryptoMarketMain
      marketCode={code}
      marketData={marketData}
      marketCurrent={marketCurrent}
      communityNode={<CryptoMarketCommunityPage params={awaitParams} searchParams={awaitSearchParams} />}
    />
  );
}
