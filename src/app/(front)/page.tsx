import CryptoServerApi from "@/apis/api/cryptos/CryptoServerApi";
import TradeGoApi from "@/apis/api/cryptos/TradeGoApi";
import Title from "@/components/main/Title";
import TodayMarkets from "@/components/main/TodayMarkets";

export default async function Home() {
  const getMarketsPromise = TradeGoApi.getMarketsCurrent();
  const getMarketAllPromise = CryptoServerApi.getMarketAll();

  return (
    <div className="flex flex-col items-center w-full pb-24 gap-8">
      <div className="flex flex-col w-full max-w-5xl max-md:pt-4 md:pt-8">
        <Title getMarketsPromise={getMarketsPromise} />
        <TodayMarkets getMarketsPromise={getMarketsPromise} getMarketAllPromise={getMarketAllPromise} />
      </div>
    </div>
  );
}
