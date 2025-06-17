import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  absolute top-0 left-0 z-0
  flex flex-center w-screen h-screen
`;

export const BoxContainer = tw.div`
  flex flex-col items-center p-6
  common-panel padding
`;

export const Title = tw.span`
  py-6
  text-2xl font-semibold
  text-slate-800 dark:text-slate-200
`;

export const AuthTypeSection = tw.div`
  flex flex-col items-center w-full space-y-4

  [&>.title]:text-base [&>.title]:text-slate-300 [&>.title]:font-light

  [&>.types]:flex [&>.types]:flex-col [&>.types]:space-y-4

  [&>.agreement]:flex [&>.agreement]:flex-wrap [&>.agreement]:justify-center [&>.agreement]:gap-1 [&>.agreement]:max-w-[80vw] [&>.agreement]:text-sm [&>.agreement]:text-slate-400
  [&>.agreement>button]:text-blue-500 [&>.agreement>button]:hover:underline [&>.agreement>button]:underline-offset-2
`;

export const SignupSection = tw.div`
  flex flex-col w-full gap-2

  [&>.title]:text-lg [&>.title]:text-slate-800 dark:[&>.title]:text-slate-200 
  [&>.title]:font-semibold [&>.title]:text-left

  ${({ $is_active }: StyleProps) => ($is_active ? 'opacity-100' : 'opacity-40')} 
  duration-300
`;

export const SignupSectionItem = tw.div`
  flex justify-between items-center w-full

  [&>.title]:text-sm [&>.title]:text-slate-800 dark:[&>.title]:text-slate-200 
  [&>.title]:font-normal
  [&>.value]:text-sm [&>.value]:text-slate-700 dark:[&>.value]:text-slate-300 
  [&>.value]:font-light
`;

export const SignupButton = tw.button`
  w-full h-12
  rounded-lg
  ${({ $is_active }: StyleProps) =>
    $is_active ? 'bg-violet-500/50 hover:bg-violet-500/60 text-white' : 'bg-slate-500/60 text-slate-300'}
  duration-200
`;
