import { StyleProps } from '@/types/StyleTypes';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

export const MarketLayout = tw.div`
  flex flex-col flex-1 max-xl:w-full max-w-xl:max-w-full xl:w-[1280px] pb-32 md:space-y-4
  [&>div]:px-4
`;

// 제목, 차트, 거래를 담는 레이아웃
export const MainLayout = tw.div`
  flex flex-col w-full p-1 space-y-2
`;
// 코인 이름 및 가격 정보
export const TitleLayout = tw.div<StyleProps>`
  sticky max-md:top-0 max-full:top-14 full:top-14 z-30
  flex max-md:flex-col max-md:justify-center md:justify-between md:items-center w-full max-md:h-22 max-full:h-32 full:h-32
  border-b

  ${({ $is_active }: StyleProps) => ($is_active ? 'border-slate-500/20 backdrop-blur-lg' : 'border-transparent')}

  transition-colors
`;

export const ChartAndTradeLayout = tw.div`
  flex max-md:flex-col w-full h-full gap-4
`;
export const ChartLayout = tw.div`
  flex flex-col max-md:h-[400px] md:h-full p-3
  rounded-lg bg-slate-800/60
`;
export const TradeLayout = tw.div`
  flex flex-col max-md:w-full md:flex-1 md:max-w-[264px] max-md:h-[528px] md:h-full max-md:px-2
`;

export const BottomLayout = tw.div`
  flex w-full gap-4 max-md:mt-4 max-md:!px-2
`;
export const MyTradeLayout = tw.div`
  md:sticky md:top-56
  flex flex-col flex-1
`;
export const CommunityLayout = tw.div`
  max-lg:hidden lg:flex flex-col w-128 min-h-[10rem]
`;

export const MarketListLayout = tw.div`
  sticky top-14 z-0
  flex flex-col max-sm:w-full sm:w-96 h-[calc(100dvh-8rem)] max-md:p-2 max-full:p-3 full:p-4 full:pt-8 space-y-4
`;

export const MarketListBox = tw.div`
  flex flex-col w-full h-full space-y-2

  [&>input]:px-3 [&>input]:py-2 [&>input]:w-full 
  [&>input]:rounded-lg
  [&>input]:bg-slate-500/50
  [&>input]:text-slate-300

  [&>.market-type]:grid [&>.market-type]:grid-cols-4 [&>.market-type]:gap-2 [&>.market-type]:w-full [&>.market-type]:min-h-[2rem]
  [&>.market-type>button]:w-full [&>.market-type>button]:h-full
  [&>.market-type>button]:rounded-lg [&>.market-type>button]:hover:bg-slate-700/30
  [&>.market-type>button]:text-slate-300 [&>.market-type>button]:hover:text-slate-100
  [&>.market-type>button.active]:bg-slate-700/70
  [&>.market-type>button]:transition-colors

  [&>.market-sort]:grid [&>.market-sort]:grid-cols-4 [&>.market-sort]:w-full [&>.market-sort]:min-h-[1.5rem]
  [&>.market-sort>button]:text-slate-500 [&>.market-sort>button]:hover:text-slate-300 [&>.market-sort>button]:font-light
  [&>.market-sort>button.active]:text-slate-200
  [&>.market-sort>button]:text-sm [&>.market-sort>button]:space-x-1
  [&>.market-sort>button]:transition-colors
  [&>.market-sort>button>.icon]:text-xs
  [&>.market-sort>button>.icon]:opacity-0 [&>.market-sort>button.active>.icon]:opacity-100

  [&>.list]:flex [&>.list]:flex-col [&>.list]:w-full [&>.list]:h-full [&>.list]:space-y-1
  full:[&>.list]:p-2 [&>.list]:rounded-lg full:[&>.list]:bg-slate-500/10
  [&>.list]:overflow-y-auto
`;

export const MarketListItem = tw(Link)`
  flex shrink-0 items-center w-full h-12 max-md:px-1 md:px-2
  rounded-md hover:bg-slate-700/30 
  text-sm text-slate-200
  transition-colors

  [&>.change-color]:text-slate-200
  [&.rise>.change-color]:text-red-500 [&.fall>.change-color]:text-blue-500

  [&>.name]:flex [&>.name]:flex-col [&>.name]:flex-1 [&>.name]:min-w-0 [&>.name]:pr-1
  [&>.name>span]:truncate
  [&>.name>.korean]:text-sm [&>.name>.korean]:text-slate-200 [&>.name>.korean]:font-medium
  [&>.name>.english]:text-[10px] [&>.name>.english]:text-slate-400 [&>.name>.english]:font-extralight

  [&>.price]:flex [&>.price]:flex-col [&>.price]:w-24
  [&>.price]:font-medium
  [&>.price>.volume]:text-[11px] [&>.price>.volume]:text-slate-400 [&>.price>.volume]:font-extralight

  [&>.change]:flex [&>.change]:flex-col [&>.change]:w-12
  [&>.change>.rate]:text-sm 
  [&>.change>.price]:text-[10px] [&>.change>.price]:font-extralight
`;

export const MainTitleBox = tw.div`
  flex items-center space-x-1

  [&>.image]:relative [&>.image]:flex [&>.image]:flex-center [&>.image]:w-[28px] [&>.image]:aspect-square

  [&>.title]:text-3xl [&>.title]:text-slate-50 [&>.title]:font-semibold

  [&>.info]:flex [&>.info]:flex-col
  [&>.info>.english]:text-sm [&>.info>.english]:text-slate-400
  [&>.info>.code]:text-[10px] [&>.info>.code]:text-slate-500
`;

export const MainPriceBox = tw.div`
  flex items-baseline gap-1
  text-slate-200
  [&.rise]:text-red-500 [&.fall]:text-blue-500

  max-md:[&>.price]:text-xl md:[&>.price]:text-2xl [&>.price>.currency]:text-sm
  [&>.price]:font-semibold
  [&>.change]:flex [&>.change]:items-baseline [&>.change]:pl-2 [&>.change]:space-x-1
  max-md:[&>.change]:text-base md:[&>.change]:text-xl
  [&>.change>.price>.currency]:text-xs [&>.change>.price]:font-light
`;

export const MainPriceInfoGrid = tw.div`
  flex gap-3

  [&>div]:flex [&>div]:flex-col [&>div]:gap-3
  [&_dl]:flex [&_dl]:justify-between [&_dl]:items-center [&_dl]:w-full
  [&_dt]:text-sm [&_dt]:text-slate-400 [&_dt]:font-light
  [&_dd]:text-slate-300 [&_dd]:text-right
  [&_dd.rise]:text-red-500 [&_dd.fall]:text-blue-500
`;
