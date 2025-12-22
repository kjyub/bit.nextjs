'use client';

import useTradeMarketSocket from '@/hooks/sockets/useTradeMarketSocket';
import useBreakpoint from '@/hooks/useBreakpoint';
import { cn } from '@/utils/StyleUtils';
import { useParams, usePathname } from 'next/navigation';
import { type Dispatch, type SetStateAction, createContext, useLayoutEffect, useState } from 'react';

/**
 * 암호화폐 레이아웃 모드
 * - wide: 넓은 레이아웃 (거래소)
 * - compact: 컴팩트한 레이아웃 (내 지갑, 토론방)
 */
export type CryptoLayoutMode = 'wide' | 'compact';

interface CryptoState {
  layoutMode: CryptoLayoutMode;
  isShowMarketList: boolean;
  setIsShowMarketList: Dispatch<SetStateAction<boolean>>;
  isShowMobileChart: boolean;
  setIsShowMobileChart: Dispatch<SetStateAction<boolean>>;
}

const initCryptoState: CryptoState = {
  layoutMode: 'wide',
  isShowMarketList: false,
  setIsShowMarketList: () => {},
  isShowMobileChart: false,
  setIsShowMobileChart: () => {},
};

export const CryptoContext = createContext<CryptoState>(initCryptoState);

export const CryptoProvider = ({
  defaultLayoutMode,
  children,
}: {
  defaultLayoutMode: CryptoLayoutMode;
  children: React.ReactNode;
}) => {
  useTradeMarketSocket();

  const params = useParams();
  const currentCode = params?.code || 'KRW-BTC';
  const pathname = usePathname();

  const [layoutMode, setLayoutMode] = useState<CryptoLayoutMode>(defaultLayoutMode);

  const [isShowMarketList, setIsShowMarketList] = useState<boolean>(false);
  const [isShowMobileChart, setIsShowMobileChart] = useState<boolean>(false);

  const { breakpointState } = useBreakpoint();

  useLayoutEffect(() => {
    if (breakpointState.full) {
      setIsShowMarketList(false);
    }
  }, [breakpointState.full]);

  useLayoutEffect(() => {
    if (pathname === `/crypto/${currentCode}`) {
      setLayoutMode('wide');
    } else {
      setLayoutMode('compact');
    }

    window.scrollTo(0, 0);
  }, [pathname, currentCode]);

  return (
    <CryptoContext.Provider
      value={{ layoutMode, isShowMarketList, setIsShowMarketList, isShowMobileChart, setIsShowMobileChart }}
    >
      <div className={cn(['group/crypto', layoutMode])}>{children}</div>
    </CryptoContext.Provider>
  );
};
