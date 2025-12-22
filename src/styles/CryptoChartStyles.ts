import tw from 'tailwind-styled-components';

export const ControlBar = tw.div`
  flex flex-wrap w-full pb-2 gap-1
  border-b border-surface-sub-border

  max-sm:[&_button]:px-1.5 sm:[&_button]:px-2 [&_button]:py-1
  [&_button]:text-surface-sub-text [&_button]:hover:text-surface-main-text/80 [&_button.active]:text-surface-main-text
  [&_button]:transition-colors

  [&_.split]:border-r [&_.split]:border-surface-sub-border

  [&>.list]:flex [&>.list]:flex-wrap [&>.list]:gap-1
`;
