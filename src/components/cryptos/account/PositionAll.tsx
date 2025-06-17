import Guage from '@/components/atomics/Guage';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import { TextFormats } from '@/types/CommonTypes';
import { MarginModeTypes, PositionTypes, type PriceChangeType, PriceChangeTypes } from '@/types/cryptos/CryptoTypes';
import type TradePosition from '@/types/cryptos/TradePosition';
import CommonUtils from '@/utils/CommonUtils';
import CryptoUtils from '@/utils/CryptoUtils';
import TypeUtils from '@/utils/TypeUtils';
import { useMemo } from 'react';

interface Values {
  pnl: number;
  pnlRatio: number;
  priceChange: PriceChangeType;
  totalMarginPrice: number;
  isCrossMode: boolean;
  liqRatio: number;
}

interface Props {
  positions: TradePosition[];
  balance: number;
  isLoading: boolean;
}
export default function PositionAll({ positions, balance, isLoading }: Props) {
  const marketDic = useMarketPriceStore((state) => state.marketDic);

  const marketPrices = useMemo(() => {
    const prices: Record<string, number> = {};
    for (const code of positions.map((position) => position.market.code)) {
      prices[code] = marketDic[code]?.trade_price ?? 0;
    }
    return prices;
  }, [positions, marketDic]);

  const values = useMemo(() => {
    const value: Values = {
      pnl: 0,
      pnlRatio: 0,
      priceChange: PriceChangeTypes.EVEN,
      totalMarginPrice: 0,
      isCrossMode: false,
      liqRatio: 0,
    };

    for (const position of positions) {
      const marketPrice = marketPrices[position.market.code];
      const pnl = CryptoUtils.getPnl(marketPrice, position.quantity, position.averagePrice, position.positionType);
      value.pnl += pnl;
      value.pnlRatio += pnl / position.marginPrice;
      value.totalMarginPrice += position.marginPrice;

      if (position.marginMode === MarginModeTypes.CROSSED) {
        value.isCrossMode = true;
      }
    }

    if (value.pnl > 0) {
      value.priceChange = PriceChangeTypes.RISE;
    } else if (value.pnl < 0) {
      value.priceChange = PriceChangeTypes.FALL;
    }

    if (value.isCrossMode) {
      value.liqRatio = (value.pnl * -1) / (balance + value.totalMarginPrice);
    } else {
      value.liqRatio = (value.pnl * -1) / value.totalMarginPrice;
    }

    return value;
  }, [positions, marketPrices, balance]);

  return (
    <div className="flex max-md:flex-col md:flex-row w-full gap-2">
      {/* 가격 정보 */}
      <div className="flex flex-col max-sm:w-full sm:w-56 gap-4">
        {/* 전체 손익 */}
        <div className="flex flex-col max-sm:w-full sm:gap-1">
          <span className="text-slate-300">전체 손익</span>
          <span className={`text-2xl font-bold price-color ${values.priceChange} ${isLoading ? 'skeleton w-24' : ''}`}>
            {CommonUtils.textFormat(TypeUtils.round(values.pnl, 0), TextFormats.NUMBER)}W
          </span>
        </div>
        {/* 전체 손익률 */}
        <div className="flex flex-col max-sm:w-full sm:gap-1">
          <span className="text-slate-300">전체 손익률</span>
          <span className={`text-2xl font-bold price-color ${values.priceChange} ${isLoading ? 'skeleton w-24' : ''}`}>
            {TypeUtils.round(values.pnlRatio * 100, 2)}%
          </span>
        </div>
      </div>

      {/* 게이지 청산 위험도, 수익률 */}
      <div className="flex justify-evenly items-center flex-1 max-sm:gap-6 sm:gap-8">
        <div className="flex flex-col w-fit">
          <Guage
            ratio={isLoading ? 0 : values.liqRatio}
            title="청산 위험도"
            helpText={values.isCrossMode ? '교차' : '격리'}
            color="#ea7500"
            size={120}
          />
        </div>
        <div className="flex flex-col w-fit">
          <Guage
            ratio={isLoading ? 0 : values.pnl / values.totalMarginPrice}
            title="수익률"
            color="#04c324"
            size={120}
            isMaxLimit={false}
          />
        </div>
      </div>
    </div>
  );
}
