// 주문 관련 상태 관리용

'use client';

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
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tradePrice, setTradePrice] = useState<number>(0);

  return (
    <CryptoMarketTradeContext.Provider value={{ tradePrice, setTradePrice }}>
      {children}
    </CryptoMarketTradeContext.Provider>
  );
};
