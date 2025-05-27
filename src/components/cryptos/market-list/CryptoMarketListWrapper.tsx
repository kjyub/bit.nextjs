'use client';

import useBreakpoint from '@/hooks/useBreakpoint';
import { useCryptoUi } from '@/hooks/useCryptoUi';
import { useEffect } from 'react';
import tw from 'tailwind-styled-components';

const Wrapper = tw.div`
  fixed top-4 max-sm:inset-x-4 sm:right-4 z-50
  flex
  rounded-md bg-slate-900/70 backdrop-blur-lg
  border border-slate-600/50

  transition-transform duration-300 ease-in-out will-change-transform
  ${({ $is_open }) => ($is_open ? '' : 'translate-x-[410px]')}

  max-md:[&>div]:py-2 md:[&>div]:py-4
`;

export default function CryptoMarketListWrapper({ children }: { children: React.ReactNode }) {
  const { breakpointState } = useBreakpoint();
  const { isShowMarketList, setIsShowMarketList } = useCryptoUi();

  useEffect(() => {
    if (breakpointState['full']) {
      setIsShowMarketList(false);
    }
  }, [breakpointState]);

  if (breakpointState['full']) {
    return children;
  }

  return <Wrapper $is_open={isShowMarketList}>{children}</Wrapper>;
}
