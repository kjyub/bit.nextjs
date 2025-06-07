import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  sticky top-0 z-50
  max-md:hidden md:flex justify-center items-center w-screen h-14 p-4
  border-b border-slate-800
  bg-slate-900 backdrop-blur
  duration-300

  [&>.content]:flex [&>.content]:justify-between [&>.content]:items-center [&>.content]:w-full
  [&>.content]:max-w-(--breakpoint-2xl)
`;

export const Section = tw.div`
  flex items-center max-md:gap-1 md:gap-2
  text-slate-300

  [&_.btn]:flex [&_.btn]:justify-center [&_.btn]:items-center max-md:[&_.btn]:px-2 md:[&_.btn]:px-3 max-md:[&_.btn]:py-1 md:[&_.btn]:py-3 [&_.btn]:space-x-1
  [&_.btn]:rounded-lg [&_.btn]:hover:bg-white/10
  max-md:[&_.btn]:text-sm
  [&_.btn]:text-slate-300/70 [&_.btn]:hover:text-slate-100 [&_.btn]:font-semibold
  [&_.btn.active]:text-slate-100
  [&_.btn]:transition-colors [&_.btn]:select-none
  [&_.btn>i]:text-xs
`;
