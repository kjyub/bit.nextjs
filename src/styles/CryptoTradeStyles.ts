import type { StyleProps } from '@/types/StyleTypes';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';

export const TradeBox = tw.div`
  flex flex-col w-full h-full max-md:gap-2 md:gap-3
`;

export const HelpBox = tw.div`
  relative
  flex flex-center aspect-square h-5
  text-surface-sub-text hover:text-surface-main-text
  transition-colors cursor-pointer

  [&.left-top>div]:bottom-7 [&.left-top>div]:right-0
  [&.left-bottom>div]:top-7 [&.left-bottom>div]:right-0
  [&.right-top>div]:bottom-7 [&.right-top>div]:left-0
  [&.right-bottom>div]:top-7 [&.right-bottom>div]:left-0

  [&>div]:absolute [&>div]:-z-10 
  [&>div]:opacity-0 [&>div.show]:opacity-100 [&>div.show]:z-50 [&>div]:transition-opacity
  [&>div]:flex [&>div]:flex-col [&>div]:space-y-2
  [&>div]:w-64 [&>div]:px-2 [&>div]:py-1.5 
  [&>div]:rounded-sm [&>div]:bg-surface-modal-background [&>div]:backdrop-blur-lg
  [&>div]:text-surface-main-text [&>div]:text-xs
`;

export const Title = tw.span`
  text-sm text-surface-main-text
`;
export const Title2 = tw.span`
  text-sm text-surface-sub-text font-light
`;

export const InputBox = tw.div<StyleProps>`
  flex items-center w-full h-7 p-2
  rounded-lg bg-surface-floating-background hover:bg-surface-floating-background/70
  focus-within:ring-1 focus-within:ring-violet-500
  [&>.input]:text-sm [&>.input]:text-surface-main-text [&>.input]:bg-transparent
  [&>.input]:outline-hidden [&>.input]:focus:outline-hidden

  ${({ $is_focus }) => ($is_focus ? 'ring-1 ring-violet-500' : '')}
  duration-200
`;

export const MarginModeBox = tw.div`
  relative
  flex items-center w-full h-full
  text-sm

  *:duration-300
  [&>button]:z-20 [&>button]:w-1/2 [&>button]:h-full [&>button]:space-x-2
  [&>button]:text-surface-sub-text [&>button.active]:text-surface-main-text

  [&>.thumb]:absolute [&>.thumb]:z-10 [&>.thumb]:top-0 [&>.thumb]:left-0 [&>.thumb.right]:left-1/2
  [&>.thumb]:w-1/2 [&>.thumb]:h-full
  [&>.thumb]:rounded-full [&>.thumb]:bg-violet-600

  [&>.bg]:w-full [&>.bg]:h-full
  [&>.bg]:rounded-full [&>.bg]:bg-transparent
  mouse:hover:[&>.bg.active]:bg-surface-common-background touch:active:[&>.bg.active]:bg-surface-common-background
  [&>.bg.active]:w-[calc(100%+0.5rem)] [&>.bg.active]:h-[calc(100%+0.5rem)]
`;

export const SliderBox = tw.div`
  relative
  flex items-center w-full
`;
export const SliderBar = tw.div`
  absolute top-1/2 translate-y-[calc(-50%)] z-0
  w-full h-[1px]
  border-t border-surface-common-border
`;
export const SliderMark = tw.div`
  absolute top-0 -translate-x-[1px] z-0
  border-x border-surface-common-border
  w-[1px] h-4
`;

export const OrderTypeBox = tw.div`
  flex items-center w-full h-full
  text-sm

  *:duration-300
  [&>button]:z-20 [&>button]:w-1/2 [&>button]:h-full [&>button]:space-x-2
  [&>button]:text-surface-sub-text [&>button]:hover:text-surface-main-text/80
  [&>button.active]:text-violet-400 [&>button.active]:hover:text-violet-500 [&>button.active]:font-semibold
`;

const TradeButton = tw.button`
  w-full max-md:h-9 md:h-10
  rounded-lg
  max-md:text-sm md:text-base text-white font-medium
  transition-colors
`;
export const TradeLongButton = tw(TradeButton)`
  bg-position-long-1 hover:bg-position-long-2
`;
export const TradeShortButton = tw(TradeButton)`
  bg-position-short-1 hover:bg-position-short-2
`;

export const SummaryItem = tw.div`
  flex justify-between items-center w-full
  [&>.label]:text-xs [&>.label]:text-surface-sub-text
  [&>.value]:text-sm [&>.value]:text-surface-main-text
`;
