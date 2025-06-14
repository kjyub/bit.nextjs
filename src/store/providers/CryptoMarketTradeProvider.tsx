// 주문 관련 상태 관리용

'use client';

import CryptoMarketChartProvider from '@/components/cryptos/market/MarketChartProvider';
import { type Dispatch, type SetStateAction, createContext, useState } from 'react';

interface CryptoState {
  tradePrice: number;
  setTradePrice: Dispatch<SetStateAction<number>>;
}

const initCryptoState: CryptoState = {
  tradePrice: 0,
  setTradePrice: () => {},
};

export const CryptoMarketTradeContext = createContext<CryptoState>(initCryptoState);

export const CryptoMarketTradeProvider = ({
  marketCode,
  children,
}: {
  marketCode: string;
  children: React.ReactNode;
}) => {
  const [tradePrice, setTradePrice] = useState<number>(0);

  return (
    <CryptoMarketTradeContext.Provider value={{ tradePrice, setTradePrice }}>
      <CryptoMarketChartProvider marketCode={marketCode}>
        {children}
      </CryptoMarketChartProvider>
    </CryptoMarketTradeContext.Provider>
  );
};
