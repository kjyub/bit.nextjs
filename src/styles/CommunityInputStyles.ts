import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  flex flex-col w-full space-y-1
`;
export const Label = tw.label`
  text-sm text-surface-sub-text dark:text-surface-main-text
`;
export const HelpText = tw.label`
  text-xs text-surface-sub-text dark:text-surface-sub-text font-light
`;

export const InputColor = tw.div`
  border-surface-common-border dark:border-surface-common-border
  bg-surface-sub-background dark:bg-surface-sub-background
  text-surface-main-text dark:text-surface-main-text
  [&>.value]:text-surface-main-text dark:[&>.value]:text-surface-main-text
  disabled:bg-black/20 dark:disabled:bg-black/30
  disabled:[&>.value]:text-surface-sub-text dark:disabled:[&>.value]:text-surface-sub-text
`;

export const InputContainer = tw.div`
  relative
  flex items-center w-full h-12 space-x-2
`;
export const InputBox = tw(InputColor)`
  flex items-center justify-between w-full h-full p-4
  rounded-lg 

  ${({ $is_active }: StyleProps) => ($is_active ? 'border-2 border-blue-500!' : 'border')}
  ${({ $is_error }: StyleProps) => ($is_error ? 'border-red-500' : '')}
  duration-200
`;
export const Input = tw.input`
  w-full bg-transparent
`;
export const FeatureButton = tw.button`
  shrink-0
  flex flex-center h-full p-4
  rounded-lg border 
  border-blue-500 text-blue-500
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
    border-blue-200 dark:border-blue-600
    bg-blue-100 dark:bg-blue-700
    text-blue-800 dark:text-blue-100
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

  [&>option]:flex [&>option]:items-center [&>option]:shrink-0 [&>option]:px-2 [&>option]:py-1 
  [&>option]:rounded-lg [&>option]:hover:bg-surface-common-background dark:[&>option]:hover:bg-surface-common-background
  [&>option]:text-surface-main-text dark:[&>option]:text-surface-main-text
`;

export const TitleBox = tw.div`
  relative
  flex w-full p-2
  border-b border-surface-common-border
  focus-within:border-blue-500
  duration-200 *:duration-200
  overflow-visible

  [&>input]:w-full [&>input]:bg-transparent
  [&>input]:text-surface-main-text
  [&>input]:placeholder:text-surface-sub-text

  [&>strong]:absolute [&>strong]:z-10
  [&>strong]:top-2 [&>strong]:left-2
  [&>strong]:text-surface-sub-text
  [&>strong.active]:-top-3 [&>strong.active]:left-0
  [&>strong.active]:text-[13px]
  [&>strong.focus]:text-blue-400
`;

export const ContentTextArea = tw.textarea`
  w-full h-24 min-h-[20vh] max-h-[50vh] p-3
  bg-surface-sub-background
  text-surface-main-text
  border-surface-common-border
  rounded-lg border
  focus:outline-hidden focus:border-blue-500
  transition-colors resize-none
`;
