import { CRYPTO_WALLET_UNIT } from '@/constants/CryptoConsts';
import { TextFormats } from '@/types/CommonTypes';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import { type PriceChangeType, PriceChangeTypes } from '@/types/cryptos/CryptoTypes';
import FormatUtils from '@/utils/FormatUtils';
import CryptoUtils from '@/utils/CryptoUtils';
import { cn } from '@/utils/StyleUtils';
import Link from 'next/link';
import TodayMarketTitleWrapper from './TodayMarketTitleWrapper';

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

  // 변화율 기준 정렬 내림차순
  const profitRateOrderd = markets.sort((a, b) => b.signed_change_rate - a.signed_change_rate);
  const profitRateOrderedTop5 = profitRateOrderd.slice(0, 5);

  return (
    <div className="flex flex-col w-full p-4 gap-4">
      <TodayMarketTitleWrapper>
        <i className="fa-solid fa-rocket"></i>
        <h3 className="text-xl md:text-2xl font-bold text-center text-surface-main-text">오늘의 종목</h3>
      </TodayMarketTitleWrapper>

      <div className="grid sm:grid-cols-2 gap-4 [&>div]:p-4 [&>div]:bg-surface-sub-background [&>div]:rounded-xl">
        <div className="flex flex-col w-full gap-2">
          <h4 className="px-1 text-lg text-surface-main-text">
            <i className="fa-solid fa-chart-simple mr-1"></i>
            <span>거래대금</span>
          </h4>
          <div className="flex flex-col w-full divide-y divide-surface-common-border">
            {volumeOrderedTop5.map((market) => (
              <MarketItemVolume key={market.code} market={market} marketDic={marketDic} />
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full gap-2">
          <h4 className="px-1 text-lg  text-surface-main-text">
            <i className="fa-solid fa-chart-line mr-1"></i>
            <span>변화율</span>
          </h4>
          <div className="flex flex-col w-full divide-y divide-surface-common-border">
            {profitRateOrderedTop5.map((market) => (
              <MarketItemPriceChange key={market.code} market={market} marketDic={marketDic} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const MarketItemLayout = ({
  market,
  marketDic,
  children,
}: { market: IUpbitMarketTicker; marketDic: Record<string, CryptoMarket>; children: React.ReactNode }) => {
  const priceChangeType: PriceChangeType = CryptoUtils.getPriceChangeType(market.trade_price, market.opening_price);

  return (
    <Link
      href={`/crypto/${market.code}`}
      className={cn([
        'flex justify-between items-center px-3 py-3 mouse:hover:bg-surface-common-background touch:active:bg-surface-common-background [&_*]:leading-[110%]',
        '[&>.section]:flex [&>.section]:flex-col [&>.section.price]:items-end [&>.section.price]:w-40',
        '[&>.section.price>.main]:text-sm md:[&>.section.price>.main]:text-base [&>.section.price>.main]:text-surface-sub-text',
        '[&>.section.price>.sub]:text-xs md:[&>.section.price>.sub]:text-sm [&>.section.price>.sub]:text-surface-sub-text',
        { '[&_.position]:!text-position-short-strong': priceChangeType === PriceChangeTypes.FALL },
        { '[&_.position]:!text-position-long-strong': priceChangeType === PriceChangeTypes.RISE },
      ])}
    >
      <div className="section">
        <h4 className="text-base md:text-lg font-semibold position">
          {marketDic[market.code]?.koreanName || market.market}
        </h4>
        <p className="text-xs md:text-sm text-surface-sub-text">{market.code}</p>
      </div>
      <div className="section price">{children}</div>
    </Link>
  );
};

const MarketItemVolume = ({
  market,
  marketDic,
}: { market: IUpbitMarketTicker; marketDic: Record<string, CryptoMarket> }) => {
  const priceChangeType: PriceChangeType = CryptoUtils.getPriceChangeType(market.trade_price, market.opening_price);
  const priceChangePercent = market.signed_change_rate;

  return (
    <MarketItemLayout market={market} marketDic={marketDic}>
      <p className="main position">
        {CryptoUtils.getPriceText(market.trade_price)}
        {CRYPTO_WALLET_UNIT}
      </p>
      <p className="sub">
        {`거래대금: ${FormatUtils.textFormat(market.acc_trade_price_24h, TextFormats.KOREAN_PRICE_SIMPLE)}`}
      </p>
    </MarketItemLayout>
  );
};

const MarketItemPriceChange = ({
  market,
  marketDic,
}: { market: IUpbitMarketTicker; marketDic: Record<string, CryptoMarket> }) => {
  const priceChangeType: PriceChangeType = CryptoUtils.getPriceChangeType(market.trade_price, market.opening_price);
  const priceChangePercent = market.signed_change_rate * 100;

  return (
    <MarketItemLayout market={market} marketDic={marketDic}>
      <p className="main position">
        {priceChangeType === PriceChangeTypes.RISE ? '+' : ''}
        {priceChangePercent.toFixed(2)}%
      </p>
      <p className="sub">{`현재가격: ${CryptoUtils.getPriceText(market.trade_price)}${CRYPTO_WALLET_UNIT}`}</p>
    </MarketItemLayout>
  );
};
