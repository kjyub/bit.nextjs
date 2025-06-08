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
import { useMemo } from 'react';
import { Position } from '../mytrade/MyTradePosition';

export default function BalanceManager() {
  const { marketDic } = useMarketPriceStore();
  const { balance, myTrades } = useUserInfoStore();

  const { positions } = myTrades;

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

    positions.forEach((position) => {
      const marketPrice = marketDic[position.market.code]?.trade_price ?? 0;
      const pnl = CryptoUtils.getPnl(marketPrice, position.quantity, position.averagePrice, position.positionType);
      value.pnl += pnl;
      value.pnlRatio += pnl / position.marginPrice;
    });

    if (value.pnl > 0) {
      value.priceChange = PriceChangeTypes.RISE;
    } else if (value.pnl < 0) {
      value.priceChange = PriceChangeTypes.FALL;
    }

    return value;
  }, [positions]);

  return (
    <S.WalletLayout>
      <span className="title">투자 내역</span>
      <div className="flex max-sm:flex-col w-full gap-2">
        {/* 가격 정보 */}
        <div className="flex max-sm:flex-row sm:flex-col max-sm:w-full sm:w-56 gap-8">
          <div className="flex flex-col max-sm:w-full sm:gap-1">
            <span className="max-sm:text-sm text-slate-300">전체 손익</span>
            <span className={`max-sm:text-lg sm:text-2xl font-bold price-color ${values.priceChange}`}>
              {CommonUtils.textFormat(TypeUtils.round(values.pnl, 0), TextFormats.NUMBER)}W
            </span>
          </div>
          <div className="flex flex-col max-sm:w-full sm:gap-1">
            <span className="max-sm:text-sm text-slate-300">전체 손익률</span>
            <span className={`max-sm:text-lg sm:text-2xl font-bold price-color ${values.priceChange}`}>
              {TypeUtils.round(values.pnlRatio * 100, 2)}%
            </span>
          </div>

          {values.pnl < 0 && (
            <div className="max-md:hidden md:flex flex-col w-fit mt-auto">
              <Guage ratio={(values.pnl * -1) / balance} title="청산 위험도" color="red" size={120} />
            </div>
          )}
        </div>

        {/* 가격 정보 차트 */}
        <div className="flex flex-col flex-1 h-96 gap-2 overflow-y-auto scroll-transparent [&_.close-box]:hidden">
          {/* <div className="h-44 aspect-square rounded-full bg-red-400"></div> */}
          {positions.map((position, index) => (
            <Position key={index} position={position} userBudget={balance} />
          ))}
        </div>
      </div>
    </S.WalletLayout>
  );
}
