import type { StyleProps } from '@/types/StyleTypes';
import styled from 'styled-components';
import tw from 'tailwind-styled-components';

export const TradeBox = tw.div`
  flex flex-col w-full h-full max-md:gap-2 md:gap-3
`;

export const HelpBox = tw.div`
  relative
  flex flex-center aspect-square h-5
  text-slate-400 hover:text-slate-300
  transition-colors cursor-pointer

  [&.left-top>div]:bottom-7 [&.left-top>div]:right-0
  [&.left-bottom>div]:top-7 [&.left-bottom>div]:right-0
  [&.right-top>div]:bottom-7 [&.right-top>div]:left-0
  [&.right-bottom>div]:top-7 [&.right-bottom>div]:left-0

  [&>div]:absolute [&>div]:-z-10 
  [&>div]:opacity-0 [&>div.show]:opacity-100 [&>div.show]:z-50 [&>div]:transition-opacity
  [&>div]:flex [&>div]:flex-col [&>div]:space-y-2
  [&>div]:w-64 [&>div]:px-2 [&>div]:py-1.5 [&>div]:rounded-sm [&>div]:bg-slate-700
  [&>div]:text-slate-300 [&>div]:text-xs
`;

export const Title = tw.span`
  text-sm text-slate-300
`;
export const Title2 = tw.span`
  text-sm text-slate-400 font-light
`;

export const InputBox = tw.div<StyleProps>`
  flex items-center w-full h-7 p-2
  rounded-lg bg-slate-500/20
  hover:ring-1 hover:ring-violet-700
  focus-within:ring-1 focus-within:ring-violet-500
  [&>.input]:text-sm [&>.input]:text-slate-300 [&>.input]:bg-transparent
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
  [&>button]:text-slate-400 [&>button.active]:text-slate-100

  [&>.thumb]:absolute [&>.thumb]:z-10 [&>.thumb]:top-0 [&>.thumb]:left-0 [&>.thumb.right]:left-1/2
  [&>.thumb]:w-1/2 [&>.thumb]:h-full
  [&>.thumb]:rounded-full [&>.thumb]:bg-violet-600

  [&>.bg]:w-full [&>.bg]:h-full
  [&>.bg]:rounded-full [&>.bg]:bg-transparent
  mouse:hover:[&>.bg.active]:bg-slate-700/50 touch:active:[&>.bg.active]:bg-slate-700/50
  [&>.bg.active]:w-[calc(100%+0.5rem)] [&>.bg.active]:h-[calc(100%+0.5rem)]
`;

export const SliderBox = tw.div`
  relative
  flex items-center w-full
`;
export const SliderBar = tw.div`
  absolute top-1/2 translate-y-[calc(-50%)] z-0
  w-full h-[1px]
  border-t border-slate-600
`;
export const SliderMark = tw.div`
  absolute top-0 -translate-x-[1px] z-0
  border-x border-slate-600
  w-[1px] h-4
`;

export const OrderTypeBox = tw.div`
  flex items-center w-full h-full
  text-sm

  *:duration-300
  [&>button]:z-20 [&>button]:w-1/2 [&>button]:h-full [&>button]:space-x-2
  [&>button]:text-slate-500/80 [&>button]:hover:text-slate-400
  [&>button.active]:text-violet-500 [&>button.active]:hover:text-violet-500 [&>button.active]:font-semibold
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
  [&>.label]:text-xs [&>.label]:text-slate-500
  [&>.value]:text-sm [&>.value]:text-slate-400
`;
