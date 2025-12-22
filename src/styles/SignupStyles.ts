import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  absolute top-0 left-0 z-0
  flex flex-center w-full h-[100dvh] pb-12
`;

export const BoxContainer = tw.div`
  flex flex-col items-center p-6
  common-panel padding
`;

export const Title = tw.span`
  py-6
  text-2xl font-bold
  text-surface-main-text dark:text-surface-main-text
`;

export const AuthTypeSection = tw.div`
  flex flex-col items-center w-full space-y-4

  [&>.title]:text-base [&>.title]:text-surface-main-text [&>.title]:font-light

  [&>.types]:flex [&>.types]:flex-col [&>.types]:space-y-4

  [&>.agreement]:flex [&>.agreement]:flex-wrap [&>.agreement]:justify-center [&>.agreement]:gap-1 [&>.agreement]:max-w-[80vw] [&>.agreement]:text-sm [&>.agreement]:text-surface-sub-text
  [&>.agreement>button]:text-blue-500 [&>.agreement>button]:hover:underline [&>.agreement>button]:underline-offset-2
`;

export const SignupSection = tw.div`
  flex flex-col w-full gap-2

  [&>.title]:text-lg [&>.title]:text-surface-main-text dark:[&>.title]:text-surface-main-text 
  [&>.title]:font-semibold [&>.title]:text-left

  ${({ $is_active }: StyleProps) => ($is_active ? 'opacity-100' : 'opacity-40')} 
  duration-300
`;

export const SignupSectionItem = tw.div`
  flex justify-between items-center w-full

  [&>.title]:text-sm [&>.title]:text-surface-main-text dark:[&>.title]:text-surface-main-text 
  [&>.title]:font-normal
  [&>.value]:text-sm [&>.value]:text-surface-main-text dark:[&>.value]:text-surface-main-text 
  [&>.value]:font-light
`;

export const SignupButton = tw.button`
  w-full h-12
  rounded-lg
  ${({ $is_active }: StyleProps) =>
    $is_active ? 'bg-indigo-500/60 hover:bg-indigo-500/70 text-white' : 'bg-surface-sub-background text-surface-main-text'}
  duration-200
`;
