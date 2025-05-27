import Link from 'next/link';
import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  fixed bottom-0 inset-x-0 z-50
  max-md:flex md:hidden justify-between items-center w-full h-14
  bg-slate-900
  border-t border-slate-800
`;

export const LinkButton = tw(Link)`
  flex flex-col items-center justify-center h-full px-4 pt-1 gap-1
  [&>i]:text-sm
  [&>span]:text-sm [&>span]:font-semibold
  text-slate-300/70 [&.active]:text-slate-100
`;
