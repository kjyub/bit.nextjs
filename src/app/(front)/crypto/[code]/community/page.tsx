import CryptoServerApi from '@/apis/api/cryptos/CryptoServerApi';
import CryptoMarketInfo from '@/components/cryptos/market/MarketInfo';
import CryptoMarketCommunityPage from '../community';
import type { IMarketPageSearchParams } from '../page';
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';

export async function generateMetadata({ params }: Props) {
  const awaitParams = await params;
  const { code } = awaitParams;
  return {
    title: `${code} 토론방`,
  };
}

interface Props {
  params: Promise<{ code: string }>;
  searchParams: Promise<IMarketPageSearchParams>;
}
export default async function Page({ params, searchParams }: Props) {
  const awaitParams = await params;
  const awaitSearchParams = await searchParams;
  const { code } = awaitParams;

  const marketData = await CryptoServerApi.getMarket(code);
  const marketCurrent = await TradeGoApi.getMarketCurrent(code);

  return (
    <div className="max-md:w-full md:w-156 p-4">
      <CryptoMarketInfo
        marketCode={code}
        marketData={marketData}
        marketCurrent={marketCurrent}
        isShowPriceInfo={false}
      />
      <CryptoMarketCommunityPage params={awaitParams} searchParams={awaitSearchParams} />
    </div>
  );
}
