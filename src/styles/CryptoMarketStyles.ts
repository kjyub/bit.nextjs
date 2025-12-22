import type { StyleProps } from '@/types/StyleTypes';
import Link from 'next/link';
import tw from 'tailwind-styled-components';

export const MarketLayout = tw.div`
  flex flex-col flex-1 max-xl:w-full max-w-xl:max-w-full xl:w-[1280px] pb-8 max-md:mb-24 md:space-y-4
  [&>div]:px-4
`;

// 제목, 차트, 거래를 담는 레이아웃
export const MainLayout = tw.div`
  flex flex-col w-full p-1 !px-2 space-y-2
`;
// 코인 이름 및 가격 정보
export const TitleLayout = tw.div<StyleProps>`
  sticky max-md:top-1 max-md:left-1 top-4 z-30
  flex max-md:flex-col max-md:justify-center md:justify-between md:items-center max-md:w-[calc(100%-0.5rem)] w-full max-md:h-22 md:h-32
  rounded-xl border

  ${({ $is_active }: StyleProps) => ($is_active ? 'border-surface-common-border backdrop-blur-lg' : 'border-transparent')}

  transition-colors
`;

export const ChartAndTradeLayout = tw.div`
  flex w-full max-md:h-full md:h-[600px] max-sm:gap-1 sm:gap-3
`;
const BoxLayout = tw.div`
  p-3
  rounded-lg bg-surface-chart-background
`;
export const ChartLayout = tw(BoxLayout)`
  max-lg:hidden lg:flex flex-col flex-1 lg:h-full
`;
export const OrderBookLayout = tw(BoxLayout)`
  flex max-lg:flex-1 max-md:max-h-[440px] md:h-full
  sm:w-[220px]
`;
export const MobileChartLayout = tw(BoxLayout)`
  max-md:flex md:hidden flex-col max-md:h-[400px] flex-1 md:h-full
`;
export const TradeLayout = tw.div`
  flex flex-col 
  max-md:min-w-[160px] max-md:max-w-[50%] max-md:w-full 
  max-md:min-h-[440px] md:h-full
  max-md:px-2
  md:min-w-[240px] md:flex-1 md:max-w-[264px] 
`;

export const BottomLayout = tw.div`
  md:sticky md:top-48 md:z-20
  flex w-full gap-4 max-md:mt-4 max-md:!px-2 md:!px-1
`;
export const MyTradeLayout = tw.div`
  flex flex-col flex-1 
  group-[.compact]/crypto:lg:h-[calc(100vh-14rem)] group-[.wide]/crypto:full:h-[calc(100vh-14rem)]
`;
export const CommunityLayout = tw.div`
  max-lg:hidden lg:flex flex-col w-128 min-h-[10rem] lg:max-h-full
`;

export const MarketListBox = tw.div`
  flex flex-col w-full h-full space-y-2

  [&>input]:px-3 [&>input]:py-2.5 [&>input]:w-full 
  [&>input]:rounded-lg
  [&>input]:bg-surface-sub-background [&>input]:focus:bg-surface-sub-background-active
  [&>input]:text-surface-main-text
  [&>input]:transition-colors

  [&>.market-type]:grid [&>.market-type]:grid-cols-4 [&>.market-type]:gap-2 [&>.market-type]:w-full [&>.market-type]:min-h-[2rem]
  [&>.market-type>button]:w-full [&>.market-type>button]:h-full
  [&>.market-type>button]:rounded-lg [&>.market-type>button]:hover:bg-surface-sub-background
  [&>.market-type>button]:text-surface-main-text [&>.market-type>button]:hover:text-surface-main-text
  [&>.market-type>button.active]:bg-surface-sub-background-active
  [&>.market-type>button]:transition-colors

  [&>.market-sort]:grid [&>.market-sort]:grid-cols-4 [&>.market-sort]:w-full [&>.market-sort]:min-h-[1.5rem]
  [&>.market-sort>button]:text-surface-sub-text [&>.market-sort>button]:hover:text-surface-main-text [&>.market-sort>button]:font-light
  [&>.market-sort>button.active]:text-surface-main-text
  [&>.market-sort>button]:text-sm [&>.market-sort>button]:space-x-1
  [&>.market-sort>button]:transition-colors
  [&>.market-sort>button>.icon]:text-xs
  [&>.market-sort>button>.icon]:opacity-0 [&>.market-sort>button.active>.icon]:opacity-100

  [&>.list]:flex [&>.list]:flex-col [&>.list]:w-full [&>.list]:h-full [&>.list]:space-y-1 [&>.list]:rounded-lg 
  group-[.compact]/crypto:lg:[&>.list]:p-2 group-[.wide]/crypto:full:[&>.list]:p-2
  group-[.compact]/crypto:[&>.list]:lg:bg-surface-floating-background
  group-[.wide]/crypto:[&>.list]:full:bg-surface-floating-background
  [&>.list]:overflow-y-auto
`;

export const MarketListItem = tw.div`
  flex shrink-0 items-center w-full h-12 px-2
  rounded-md hover:bg-surface-common-background active:bg-surface-common-background-active
  text-sm text-surface-main-text
  transition-colors

  [&>.change-color]:text-surface-main-text
  [&.rise>.change-color]:text-position-long-strong [&.fall>.change-color]:text-position-short-strong

  [&>.name]:flex [&>.name]:flex-col [&>.name]:flex-1 [&>.name]:min-w-0 [&>.name]:pr-1
  [&>.name>span]:truncate
  [&>.name>.korean]:text-sm [&>.name>.korean]:text-surface-main-text [&>.name>.korean]:font-medium
  [&>.name>.english]:text-[10px] [&>.name>.english]:text-surface-sub-text [&>.name>.english]:font-extralight

  [&>.price]:flex [&>.price]:flex-col [&>.price]:w-24
  [&>.price]:font-medium
  [&>.price>.volume]:text-[11px] [&>.price>.volume]:text-surface-sub-text [&>.price>.volume]:font-extralight

  [&>.change]:flex [&>.change]:flex-col [&>.change]:w-12
  [&>.change>.rate]:text-sm 
  [&>.change>.price]:text-[10px] [&>.change>.price]:font-extralight
`;

export const MainTitleBox = tw.div`
  flex items-center space-x-1

  [&>.image]:relative [&>.image]:flex [&>.image]:flex-center [&>.image]:w-[28px] [&>.image]:aspect-square

  [&>.title]:text-3xl [&>.title]:text-surface-main-text [&>.title]:font-semibold

  [&>.info]:flex [&>.info]:flex-col
  [&>.info>.english]:text-sm [&>.info>.english]:text-surface-sub-text
  [&>.info>.code]:text-[10px] [&>.info>.code]:text-surface-sub-text
`;

export const MainPriceBox = tw.div`
  flex items-baseline gap-1
  text-surface-main-text
  [&.rise]:text-position-long-strong [&.fall]:text-position-short-strong

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
  [&_dt]:text-sm [&_dt]:text-surface-sub-text [&_dt]:font-light
  [&_dd]:text-surface-main-text [&_dd]:text-right
  [&_dd.rise]:text-position-long-strong [&_dd.fall]:text-position-short-strong
`;
