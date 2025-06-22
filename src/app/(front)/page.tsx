import CryptoServerApi from '@/apis/api/cryptos/CryptoServerApi';
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import Flex from '@/components/main/Flex';
import MineInfo from '@/components/main/MineInfo';
import Title from '@/components/main/Title';
import TodayMarkets from '@/components/main/TodayMarkets';

export default async function Home() {
  const getMarketsPromise = TradeGoApi.getMarketsCurrent();
  const getMarketAllPromise = CryptoServerApi.getMarketAll();

  return (
    <div className="flex flex-col items-center w-full pb-24 gap-8">
      <div className="flex flex-col w-full max-w-5xl max-md:pt-4 md:pt-8 max-md:gap-6 md:gap-12">
        <Title getMarketsPromise={getMarketsPromise} />
        <TodayMarkets getMarketsPromise={getMarketsPromise} getMarketAllPromise={getMarketAllPromise} />
        <Flex />
        <MineInfo />
      </div>
    </div>
  );
}
