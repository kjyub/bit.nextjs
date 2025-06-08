'use client';

import { useCryptoUi } from '@/hooks/useCryptoUi';
import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

const Wrapper = tw.div<StyleProps>`
  max-full:fixed full:hidden max-md:top-4 md:top-30 max-sm:inset-x-4 sm:right-4 z-50
  flex p-1
  rounded-2xl bg-slate-900/70 backdrop-blur-lg
  border border-slate-700/50

  transition-transform duration-300 ease-in-out will-change-transform
  ${({ $is_open }) => ($is_open ? '' : 'max-sm:translate-x-[100vw] sm:translate-x-[410px]')}

  max-md:[&>div]:py-2 md:[&>div]:py-4
`;

export default function CryptoMarketListWrapper({ children }: { children: React.ReactNode }) {
  const { isShowMarketList } = useCryptoUi();

  return (
    <>
      <div className="max-full:hidden full:block">{children}</div>
      <Wrapper $is_open={isShowMarketList}>{children}</Wrapper>
    </>
  );
}
