import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

export const PageWidth = tw.div`
  max-w-(--breakpoint-xl)
`;

export const PageLayout = tw.div`
  flex flex-col items-center w-screen
`;

export const PageContent = tw(PageWidth)`
  flex flex-col w-full
`;

export const ModalDimmer = tw.div<StyleProps>`
  fixed inset-0 z-50 size-full bg-black/50
  ${({ $is_active }) => ($is_active ? 'opacity-100' : 'pointer-events-none opacity-0')}
  transition-opacity duration-300
`;
