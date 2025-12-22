import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  max-md:hidden md:flex justify-center items-center w-full h-14 p-4

  [&>.content]:flex [&>.content]:justify-between [&>.content]:items-center [&>.content]:w-full
  [&>.content]:max-w-(--breakpoint-2xl)
`;

export const Section = tw.div`
  flex items-center max-md:gap-1 md:gap-2
  text-surface-main-text

  [&_.btn]:flex [&_.btn]:justify-center [&_.btn]:items-center max-md:[&_.btn]:px-2 md:[&_.btn]:px-3 max-md:[&_.btn]:py-1 md:[&_.btn]:py-3 [&_.btn]:space-x-1
  [&_.btn]:rounded-lg [&_.btn]:hover:bg-surface-common-background
  max-md:[&_.btn]:text-sm
  [&_.btn]:text-surface-sub-text [&_.btn]:hover:text-surface-main-text [&_.btn]:font-semibold
  [&_.btn.active]:text-surface-main-text
  [&_.btn]:transition-colors [&_.btn]:select-none
  [&_.btn>i]:text-xs
`;
