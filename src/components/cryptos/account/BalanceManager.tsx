'use client';

import Guage from '@/components/atomics/Guage';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoWalletStyles';
import { TextFormats } from '@/types/CommonTypes';
import type { PriceChangeType } from '@/types/cryptos/CryptoTypes';
import { MarginModeTypes, PriceChangeTypes } from '@/types/cryptos/CryptoTypes';
import CommonUtils from '@/utils/CommonUtils';
import CryptoUtils from '@/utils/CryptoUtils';
import TypeUtils from '@/utils/TypeUtils';
import { useEffect, useMemo } from 'react';
import { Position } from '../mytrade/MyTradePosition';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import { shallow } from 'zustand/shallow';

export default function BalanceManager() {
  const { balance, myTrades } = useUserInfoStore();

  const { positions } = myTrades;
  const marketDic = useMarketPriceStore((state) => state.marketDic);
  
  const marketPrices = useMemo(() => {
    const prices: Record<string, number> = {};
    for (const code of positions.map((position) => position.market.code)) {
      prices[code] = marketDic[code]?.trade_price ?? 0;
    }
    return prices;
  }, [positions, marketDic]);

  const values = useMemo(() => {
    const value: {
      pnl: number;
      pnlRatio: number;
      priceChange: PriceChangeType;
    } = {
      pnl: 0,
      pnlRatio: 0,
      priceChange: PriceChangeTypes.EVEN,
    };

    for (const position of positions) {
      const marketPrice = marketPrices[position.market.code];
      const pnl = CryptoUtils.getPnl(marketPrice, position.quantity, position.averagePrice, position.positionType);
      value.pnl += pnl;
      value.pnlRatio += pnl / position.marginPrice;
    }

    if (value.pnl > 0) {
      value.priceChange = PriceChangeTypes.RISE;
    } else if (value.pnl < 0) {
      value.priceChange = PriceChangeTypes.FALL;
    }

    return value;
  }, [positions, marketPrices]);

  return (
    <S.WalletLayout className="md:h-[calc(100vh-28rem)] max-md:mb-28">
      <span className="title">투자 내역</span>
      <div className="flex max-md:flex-col md:flex-row w-full gap-2">
        {/* 가격 정보 */}
        <div className="flex flex-col max-sm:w-full sm:w-56 gap-4">
          {/* 전체 손익 */}
          <div className="flex flex-col max-sm:w-full sm:gap-1">
            <span className="max-sm:text-sm text-slate-300">전체 손익</span>
            <span className={`max-sm:text-lg sm:text-2xl font-bold price-color ${values.priceChange}`}>
              {CommonUtils.textFormat(TypeUtils.round(values.pnl, 0), TextFormats.NUMBER)}W
            </span>
          </div>
          {/* 전체 손익률 */}
          <div className="flex flex-col max-sm:w-full sm:gap-1">
            <span className="max-sm:text-sm text-slate-300">전체 손익률</span>
            <span className={`max-sm:text-lg sm:text-2xl font-bold price-color ${values.priceChange}`}>
              {TypeUtils.round(values.pnlRatio * 100, 2)}%
            </span>
          </div>
        </div>

        {/* 게이지 청산 위험도, 수익률 */}
        <div className="flex justify-evenly items-center flex-1 max-sm:gap-6 sm:gap-8">
          <div className="flex flex-col w-fit">
            <Guage ratio={(values.pnl * -1) / balance} title="청산 위험도" color="#ea7500" size={120} />
          </div>
          <div className="flex flex-col w-fit">
            <Guage ratio={(values.pnl) / balance} title="수익률" color="#04c324" size={120} isMaxLimit={false} />
          </div>
        </div>
      </div>

      {/* 가격 정보 차트 */}
      <div className="max-md:static md:relative flex-1 md:h-full">
        <div className="max-md:static md:absolute flex flex-col w-full h-full gap-2 overflow-y-scroll scroll-transparent [&_.close-box]:hidden">
          {positions.map((position, index) => (
            <Position key={index} position={position} userBudget={balance} />
          ))}
        </div>
      </div>
    </S.WalletLayout>
  );
}
