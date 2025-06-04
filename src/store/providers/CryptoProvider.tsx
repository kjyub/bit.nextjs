'use client';

import useTradeMarketSocket from '@/hooks/sockets/useTradeMarketSocket';
import { type Dispatch, type SetStateAction, createContext, useState } from 'react';

interface CryptoState {
  isShowMarketList: boolean;
  setIsShowMarketList: Dispatch<SetStateAction<boolean>>;
  isShowMobileChart: boolean;
  setIsShowMobileChart: Dispatch<SetStateAction<boolean>>;
}

const initCryptoState: CryptoState = {
  isShowMarketList: false,
  setIsShowMarketList: () => {},
  isShowMobileChart: false,
  setIsShowMobileChart: () => {},
};

export const CryptoContext = createContext<CryptoState>(initCryptoState);

export const CryptoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useTradeMarketSocket();

  const [isShowMarketList, setIsShowMarketList] = useState<boolean>(false);
  const [isShowMobileChart, setIsShowMobileChart] = useState<boolean>(false);

  return (
    <CryptoContext.Provider value={{ isShowMarketList, setIsShowMarketList, isShowMobileChart, setIsShowMobileChart }}>
      {children}
    </CryptoContext.Provider>
  );
};
