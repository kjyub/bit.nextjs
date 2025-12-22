import type { StyleProps } from '@/types/StyleTypes';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

export const Layout = tw.div<StyleProps>`
  fixed bottom-0 inset-x-0 z-50
  max-md:flex md:hidden justify-between items-center w-full h-13
  bg-black/60 backdrop-blur-lg
  border-t border-surface-common-border

  ${({ $is_show }: StyleProps) => ($is_show ? '' : 'translate-y-14')}
  duration-300
`;

export const LinkButton = tw(Link)`
  flex flex-col items-center justify-center w-full h-full pt-1 gap-1
  [&>i]:text-sm
  [&>span]:text-[11px] [&>span]:font-medium
  text-surface-main-text/70 [&.active]:text-surface-main-text
`;
