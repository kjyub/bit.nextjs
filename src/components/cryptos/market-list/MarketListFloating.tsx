'use client';

import { useCryptoUi } from '@/hooks/useCryptoUi';
import { useDetectClose } from '@/hooks/useDetectClose';
import type { StyleProps } from '@/types/StyleTypes';
import { useEffect } from 'react';
import tw from 'tailwind-styled-components';

// breakpoint compact(모바일) 일 시
const Wrapper = tw.div<StyleProps>`
  fixed
  max-md:top-4 md:top-28 
  max-sm:left-4 sm:right-4 z-50
  flex flex-col max-sm:w-[calc(100%-2rem)] sm:w-96 h-[calc(100dvh-144px)] max-md:p-2 p-3 gap-4
  rounded-2xl bg-surface-floating-background backdrop-blur-[20px]
  border border-surface-floating-border

  transition-transform duration-300 ease-in-out will-change-transform
  ${({ $is_open }) => ($is_open ? '' : 'max-sm:translate-x-[100vw] sm:translate-x-[410px]')}
`;

export default function MarketListFloating({ children }: { children: React.ReactNode }) {
  const { isShowMarketList, setIsShowMarketList } = useCryptoUi();
  const [ref, isOpen, setIsOpen] = useDetectClose<HTMLDivElement>();

  useEffect(() => {
    setIsShowMarketList(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isShowMarketList) {
      setIsOpen(true);
    }
  }, [isShowMarketList]);

  return (
    <Wrapper ref={ref} $is_open={isOpen || isShowMarketList}>
      {children}
    </Wrapper>
  );
}
