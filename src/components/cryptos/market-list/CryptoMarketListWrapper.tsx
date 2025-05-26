'use client';

import useBreakpoint from '@/hooks/useBreakpoint';
import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';

const Wrapper = tw.div`
  fixed top-14 right-4 z-50
  flex h-[calc(100vh-6rem)] mt-4
  rounded-xl bg-slate-800/70 backdrop-blur-lg
  border border-slate-600/50

  transition-transform duration-300 ease-in-out will-change-transform
  ${({ $is_open }) => ($is_open ? '' : 'translate-x-[410px]')}
`;

export default function CryptoMarketListWrapper({ children }: { children: React.ReactNode }) {
  const { breakpointState } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {}, []);

  if (breakpointState['full']) {
    return children;
  }

  return <Wrapper $is_open={isOpen}>{children}</Wrapper>;
}
