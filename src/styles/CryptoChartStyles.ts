import tw from 'tailwind-styled-components';

export const ControlBar = tw.div`
  flex flex-wrap w-full pb-2 space-x-1
  border-b border-slate-500/50

  [&_button]:px-2 [&_button]:py-1
  [&_button]:text-slate-300/70 [&_button]:hover:text-slate-200/90 [&_button.active]:text-slate-100/90
  [&_button]:transition-colors

  [&>.split]:border-r [&>.split]:border-slate-500/50
`;
