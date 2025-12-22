import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  flex flex-col w-full space-y-1
`;
export const Label = tw.label`
  text-sm text-surface-sub-text
`;
export const HelpText = tw.label`
  text-xs text-surface-sub-text font-light
`;

export const InputColor = tw.div`
  border-surface-common-border
  bg-surface-floating-background
  text-surface-main-text
  [&>.value]:text-surface-main-text
  disabled:bg-black/30
  disabled:[&>.value]:text-surface-sub-text
`;

export const InputContainer = tw.div`
  relative
  flex items-center w-full h-12 gap-2
`;
export const InputBox = tw(InputColor)<StyleProps>`
  flex items-center justify-between w-full h-full p-4
  rounded-lg border

  ${({ $is_active }) => ($is_active ? 'border-indigo-600' : '')}
  ${({ $is_error }) => ($is_error ? 'border-red-500' : '')}
  ${({ $disabled }) => ($disabled ? 'bg-black/30 text-surface-sub-text' : '')}
  duration-200
`;
export const Input = tw.input`
  w-full bg-transparent
`;

export const Suffix = tw.span`
  text-surface-sub-text
`;
export const FeatureButton = tw.button`
  shrink-0
  flex flex-center h-full p-4
  rounded-lg border 
  border-indigo-500 text-indigo-500
  disabled:border-surface-common-border disabled:text-surface-sub-text
`;
export const ErrorMessage = tw.span`
  absolute -bottom-5 right-0
  w-full
  text-xs text-red-500
`;

export const BoolInput = tw.div`
  grid grid-cols-2 gap-4 w-full h-full
`;
export const BoolButton = tw(InputColor)`
  flex flex-center w-full
  rounded-lg border

  ${({ $is_active }: StyleProps) =>
    $is_active
      ? `
    border-indigo-200 dark:border-indigo-600
    bg-indigo-100 dark:bg-indigo-700
    text-indigo-800 dark:text-indigo-100
    `
      : `
    border-surface-common-border dark:border-surface-common-border
    bg-surface-sub-background dark:bg-surface-sub-background
    text-surface-main-text dark:text-surface-main-text
    `}
`;

export const Combo = tw(InputBox)`
`;
export const OptionBox = tw(InputColor)`
  absolute z-10 top-14 -left-2
  flex flex-col w-full max-h-[12rem] p-2 space-y-1
  rounded-lg border 
  overflow-y-auto

  [&>li]:flex [&>li]:items-center [&>li]:shrink-0 [&>li]:px-2 [&>li]:py-1 
  [&>li]:rounded-lg [&>li]:hover:bg-surface-common-background dark:[&>li]:hover:bg-surface-common-background
  [&>li]:text-surface-main-text dark:[&>li]:text-surface-main-text
`;
