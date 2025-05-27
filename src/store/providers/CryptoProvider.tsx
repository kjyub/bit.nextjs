'use client';

import useTradeMarketSocket from '@/hooks/sockets/useTradeMarketSocket';
import { Dispatch, SetStateAction, createContext, useState } from 'react';

interface CryptoState {
  isShowMarketList: boolean;
  setIsShowMarketList: Dispatch<SetStateAction<boolean>>;
}

const initCryptoState: CryptoState = {
  isShowMarketList: false,
  setIsShowMarketList: () => {},
};

export const CryptoContext = createContext<CryptoState>(initCryptoState);

export const CryptoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useTradeMarketSocket();

  const [isShowMarketList, setIsShowMarketList] = useState<boolean>(false);

  return <CryptoContext.Provider value={{ isShowMarketList, setIsShowMarketList }}>{children}</CryptoContext.Provider>;
};
