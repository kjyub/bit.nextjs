import { CRYPTO_WALLET_UNIT } from "@/constants/CryptoConsts";
import type { IUpbitMarketTicker } from "@/types/cryptos/CryptoInterfaces";
import CryptoMarket from "@/types/cryptos/CryptoMarket";
import { type PriceChangeType, PriceChangeTypes } from "@/types/cryptos/CryptoTypes";
import CryptoUtils from "@/utils/CryptoUtils";
import { cn } from "@/utils/StyleUtils";

interface Props {
  getMarketsPromise: Promise<IUpbitMarketTicker[]>;
  getMarketAllPromise: Promise<any>;
}
export default async function TodayMarkets({ getMarketsPromise, getMarketAllPromise }: Props) {
  const markets = await getMarketsPromise;
  const marketAllData = await getMarketAllPromise;
  const marketDic: Record<string, CryptoMarket> = {};
  for (const market of marketAllData) {
    const _market = new CryptoMarket();
    _market.parseResponse(market as any);
    marketDic[_market.code] = _market;
  }
  
  // 거래대금 기준 정렬 내림차순
  const volumeOrderd = markets.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h);
  const volumeOrderedTop5 = volumeOrderd.slice(0, 5);

  // 수익률 기준 정렬 내림차순
  const profitRateOrderd = markets.sort((a, b) => b.signed_change_rate - a.signed_change_rate);
  const profitRateOrderedTop5 = profitRateOrderd.slice(0, 5);

  return (
    <div className="flex flex-col w-full p-4 gap-2">
      <h3 className="px-1 text-xl md:text-2xl font-bold">오늘의 종목</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col w-full">
          <h4 className="px-1 text-base text-slate-300">거래대금</h4>
          <div className="flex flex-col w-full divide-y divide-slate-500/30">
            {volumeOrderedTop5.map((market) => (
              <MarketItem key={market.code} market={market} marketDic={marketDic} />
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full">
          <h4 className="px-1 text-base text-slate-300">수익률</h4>
          <div className="flex flex-col w-full divide-y divide-slate-500/30">
            {profitRateOrderedTop5.map((market) => (
              <MarketItem key={market.code} market={market} marketDic={marketDic} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const MarketItem = ({ market, marketDic }: { market: IUpbitMarketTicker, marketDic: Record<string, CryptoMarket> }) => {
  const priceChangeType: PriceChangeType = CryptoUtils.getPriceChangeType(market.trade_price, market.opening_price);
  const priceChangePercent = market.signed_change_rate;

  return (
    <div key={market.code} className="flex justify-between items-center px-2 py-3">
      <div className="flex flex-col">
        <h4 
          className={cn([
            'text-base md:text-lg font-semibold',
            {
              'text-position-short-strong': priceChangeType === PriceChangeTypes.FALL,
              'text-position-long-strong': priceChangeType === PriceChangeTypes.RISE,
            },
          ])}
        >
          {marketDic[market.code].koreanName}
        </h4>
        <p className="text-xs md:text-sm text-slate-500">{market.code}</p>
      </div>
      <div className="flex flex-col items-end w-32">
        <p 
          className={cn([
            'text-xs md:text-sm text-slate-500',
            {
              'text-position-short-strong': priceChangeType === PriceChangeTypes.FALL,
              'text-position-long-strong': priceChangeType === PriceChangeTypes.RISE,
            },
          ])}
        >
          {CryptoUtils.getPriceText(market.trade_price)}{CRYPTO_WALLET_UNIT}
        </p>
        <p className="text-xs md:text-sm text-slate-500">{priceChangeType === PriceChangeTypes.RISE ? '+' : ''}{priceChangePercent.toFixed(2)}%</p>
      </div>
    </div>
  );
};