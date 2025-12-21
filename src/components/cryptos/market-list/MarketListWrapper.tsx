'use client';

import { useCryptoUi } from '@/hooks/useCryptoUi';
import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

const Wrapper = tw.div<StyleProps>`
  group-[.compact]/crypto:max-lg:fixed group-[.compact]/crypto:lg:hidden 
  group-[.wide]/crypto:max-full:fixed group-[.wide]/crypto:full:hidden
  max-md:top-4 md:top-28 max-sm:inset-x-4 sm:right-4 z-50
  flex p-1
  rounded-2xl bg-slate-800/40 backdrop-blur-[20px]
  border border-slate-700/50

  transition-transform duration-300 ease-in-out will-change-transform
  ${({ $is_open }) => ($is_open ? '' : 'max-sm:translate-x-[100vw] sm:translate-x-[410px]')}

  max-md:[&>div]:py-2 md:[&>div]:py-2
`;

const Static = tw.div<StyleProps>`
  group-[.compact]/crypto:max-lg:hidden group-[.compact]/crypto:lg:block 
  group-[.wide]/crypto:max-full:hidden group-[.wide]/crypto:full:block
`;

export default function CryptoMarketListWrapper({ children }: { children: React.ReactNode }) {
  const { isShowMarketList } = useCryptoUi();

  return (
    <>
      <Static>{children}</Static>
      <Wrapper $is_open={isShowMarketList}>{children}</Wrapper>
    </>
  );
}
