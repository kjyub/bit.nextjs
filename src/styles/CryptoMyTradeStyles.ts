import type { StyleProps } from '@/types/StyleTypes';
import tw from 'tailwind-styled-components';

export const Layout = tw.div`
  flex flex-col w-full lg:h-full space-y-2
`;
export const PageTabBar = tw.div`
  flex items-center w-full px-1 md:gap-2

  [&>button]:px-2 [&>button]:py-1
  max-sm:[&>button]:text-[13px] sm:[&>button]:text-sm 
  [&>button]:text-surface-sub-text [&>button]:hover:text-surface-main-text
  [&>button.active]:text-surface-main-text [&>button.active]:bg-surface-floating-background
  [&>button]:rounded-lg
  [&>button]:duration-200
`;

export const PageLayout = tw.div<StyleProps>`
  flex flex-col w-full h-full min-h-[12rem]
  rounded-lg bg-black/20
`;
export const PageList = tw.div<StyleProps>`
  ${({ $is_active }) => ($is_active ? 'opacity-100' : 'opacity-50')}
  flex flex-col w-full pb-8 space-y-2
  overflow-y-auto scroll-transparent
  duration-200
`;

export const ItemBox = tw.div`
  flex flex-col w-full p-2
  rounded-lg bg-surface-common-background
`;

export const PositionBox = tw(ItemBox)`
  p-3 space-y-3 

  [&>.header]:flex [&>.header]:justify-between [&>.header]:items-center [&>.header]:space-x-2
  [&>.header>.position]:w-16 [&>.header>.position]:px-2 [&>.header>.position]:py-1
  [&>.header>.position]:rounded-md [&>.header>.position]:text-sm [&>.header>.position]:text-white
  [&>.header>.position.long]:bg-position-long-1 [&>.header>.position.short]:bg-position-short-1
`;
export const PositionHeader = tw.div`
  flex flex-col justify-between gap-1

  [&>.row]:flex [&>.row]:justify-between [&>.row]:items-center [&>.row]:w-full [&>.row]:gap-2
  [&_.section]:flex [&_.section]:items-center [&_.section]:gap-1.5

  [&_.position]:w-12 [&_.position]:py-[1px]
  [&_.position]:rounded-md [&_.position]:text-center
  [&_.position]:text-[11px] [&_.position]:text-white
  [&_.position.long]:bg-position-long-1 [&_.position.short]:bg-position-short-1

  [&_.title]:flex [&_.title]:items-baseline [&_.title]:space-x-1
  [&_.title>.korean]:text-sm [&_.title>.korean]:text-surface-main-text
  [&_.title>.english]:text-xs [&_.title>.english]:text-surface-sub-text
  [&_.title>.code]:text-xs [&_.title>.code]:text-surface-sub-text/80

  [&_.price]:text-sm [&_.price]:text-surface-sub-text
  [&_.price.rise]:text-position-long-strong [&_.price.fall]:text-position-short-strong

  [&_.info]:px-1 [&_.info]:py-0.5
  [&_.info]:rounded-xs [&_.info]:bg-surface-common-background-active
  [&_.info]:text-xs [&_.info]:text-surface-main-text [&_.info]:font-light

  [&_button.info]:px-1.5 [&_button.info]:py-0.5
  [&_button.info]:rounded-md [&_button.info]:bg-surface-common-background-active
  [&_button.info]:text-xs [&_button.info]:text-surface-sub-text [&_button.info]:font-medium
  [&_button.info]:hover:bg-surface-common-background-active [&_button.info]:hover:text-surface-sub-text
`;
export const PositionBody = tw.div`
  grid @max-xl:grid-cols-2 @xl:grid-cols-4 gap-2 w-full
`;
export const PositionItem = tw.dl`
  flex flex-col w-full space-y-1

  [&>dt]:text-xs [&>dt]:text-surface-main-text
  [&>dt>span]:text-surface-sub-text/80 [&>dt>span]:font-light
  [&>dd]:text-sm [&>dd]:text-surface-main-text [&>dd]:font-light
  [&.long>dd]:text-position-long-3  [&.short>dd]:text-position-short-3
`;
export const PositionClose = tw.div`
  flex flex-col w-full pt-2 max-sm:gap-1 sm:gap-2
  border-t border-surface-common-border

  [&_.title]:text-sm [&_.title]:text-surface-main-text [&_.title]:font-light max-md:[&_.title]:mr-8

  [&_.buttons]:grid [&_.buttons]:grid-cols-2 max-sm:[&_.buttons]:flex-1 [&_.buttons]:gap-2

  [&_.buttons>button]:px-2 [&_.buttons>button]:h-8 
  [&_.buttons>button]:rounded-lg 
  touch:[&_.buttons>button]:bg-transparent touch:[&_.buttons>button]:active:bg-surface-floating-background-active
  [&_.buttons>button]:bg-surface-floating-background [&_.buttons>button]:hover:bg-surface-floating-background-active
  [&_.buttons>button]:text-sm [&_.buttons>button]:font-medium
  [&_.buttons>button]:text-surface-main-text/80 [&_.buttons>button]:hover:text-surface-main-text
  [&_.buttons>button]:duration-200

  [&_.inputs]:grid [&_.inputs]:grid-cols-2 [&_.inputs]:gap-2 [&_.inputs]:flex-1
`;

export const OrderBox = tw(ItemBox)`
  p-3 space-y-3

  [&>.header]:flex [&>.header]:justify-between [&>.header]:items-center [&>.header]:space-x-2
  [&>.header>.position]:w-16 [&>.header>.position]:px-2 [&>.header>.position]:py-1
  [&>.header>.position]:rounded-md [&>.header>.position]:text-sm [&>.header>.position]:text-white
  [&>.header>.position.long]:bg-position-long-1 [&>.header>.position.short]:bg-position-short-1
`;
export const OrderHeader = tw.div`
  flex flex-col justify-between gap-1

  [&>.row]:flex [&>.row]:justify-between [&>.row]:items-center [&>.row]:w-full [&>.row]:gap-2
  [&_.section]:flex [&_.section]:items-center [&_.section]:gap-1.5

  [&_.datetime>i]:mr-1
  max-md:[&_.datetime>i]:text-[10px] md:[&_.datetime>i]:text-xs [&_.datetime>i]:text-surface-sub-text
  [&_.datetime]:rounded-md [&_.datetime]:text-left
  max-md:[&_.datetime]:text-xs md:[&_.datetime]:text-[13px] [&_.datetime]:text-surface-sub-text [&_.datetime]:font-light

  [&_.title]:flex [&_.title]:items-baseline [&_.title]:space-x-1
  [&_.title>.korean]:text-sm [&_.title>.korean]:text-surface-main-text
  [&_.title>.english]:text-xs [&_.title>.english]:text-surface-sub-text
  [&_.title>.code]:text-xs [&_.title>.code]:text-surface-sub-text/80
  
  [&_.position]:w-12 [&_.position]:py-[1px]
  [&_.position]:rounded-md [&_.position]:text-center
  [&_.position]:text-[11px] [&_.position]:text-white
  [&_.position.long]:bg-position-long-1 [&_.position.short]:bg-position-short-1

  [&_.price]:text-sm [&_.price]:text-surface-sub-text
  [&_.price.rise]:text-position-long-strong [&_.price.fall]:text-position-short-strong

  [&_.info]:px-1 [&_.info]:py-0.5
  [&_.info]:rounded-sm [&_.info]:bg-surface-common-background-active
  [&_.info]:text-xs [&_.info]:text-surface-main-text [&_.info]:font-light

  [&_button.info]:px-1.5 [&_button.info]:py-0.5
  [&_button.info]:rounded-md [&_button.info]:bg-surface-common-background-active
  [&_button.info]:text-xs [&_button.info]:text-surface-sub-text [&_button.info]:font-medium
  [&_button.info]:hover:bg-surface-common-background-active [&_button.info]:hover:text-surface-sub-text
  [&_button.info]:transition-colors

  [&_.info>.position]:text-xs 
  [&_.info>.position.long]:text-position-long-2 [&_.info>.position.short]:text-position-short-2
`;
export const OrderBody = tw.div`
  grid max-sm:grid-cols-2 sm:grid-cols-4 gap-2 w-full
`;
export const OrderItem = tw.dl`
  flex flex-col w-full space-y-1

  [&>dt]:text-xs [&>dt]:text-surface-main-text
  max-sm:[&>dt>span]:hidden [&>dt>span]:text-surface-sub-text/80 [&>dt>span]:font-light
  [&>dd]:text-sm [&>dd]:text-surface-main-text [&>dd]:font-light
  [&.long>dd]:text-position-long-strong  [&.short>dd]:text-position-short-strong
`;
export const OrderClose = tw.div`
  flex items-center w-full pt-2 space-x-3
  border-t border-violet-500/20

  [&>.title]:text-sm [&>.title]:text-violet-500 [&>.title]:font-medium

  [&>.buttons]:flex [&>.buttons]:items-center [&>.buttons]:space-x-1

  [&>.buttons>button]:px-2 [&>.buttons>button]:py-0.5
  [&>.buttons>button]:rounded-md [&>.buttons>button]:hover:bg-surface-common-background-active
  [&>.buttons>button]:text-sm [&>.buttons>button]:text-violet-400 [&>.buttons>button]:hover:text-violet-300
  [&>.buttons>button]:duration-200

  [&>.inputs]:grid [&>.inputs]:grid-cols-2 [&>.inputs]:gap-2 [&>.inputs]:flex-1
`;

export const FilterBox = tw.div<StyleProps>`
  flex flex-center px-2 py-1
  rounded-md 
  text-xs

  ${({ $is_active }) =>
    $is_active
      ? 'bg-surface-common-background-active text-surface-sub-text hover:text-surface-main-text'
      : 'text-surface-sub-text hover:bg-surface-common-background hover:text-surface-main-text'}
  transition-colors
`;
export const FilterButton = tw(FilterBox)`
  cursor-pointer
`;
export const FilterDateInputBox = tw(FilterBox)`
  px-1 space-x-1 
  [&>input]:bg-transparent [&>input]:text-center 
  [&>input]:pt-[1px] 
  [&>input]:border-b [&>input]:border-transparent 
  [&>input]:focus:border-violet-500 [&>input]:hover:border-violet-500
  [&>input]:transition-colors
`;
