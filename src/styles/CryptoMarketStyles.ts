import { StyleProps } from "@/types/StyleTypes"
import Link from "next/link"
import tw from "tailwind-styled-components"

export const Layout = tw.div`
    flex justify-center w-full
`

export const MarketLayout = tw.div`
    flex flex-col flex-1 max-w-[1280px] p-4 space-y-4
`

// 제목, 차트, 거래를 담는 레이아웃
export const MainLayout = tw.div`
    flex flex-col w-full h-[608px] p-1 space-y-2
`
// 코인 이름 및 가격 정보
export const TitleLayout = tw.div<StyleProps>`
    sticky top-[56px] z-30
    flex justify-between items-center w-full
    border-b

    ${({$is_active}: StyleProps) => $is_active ? 
        "h-32 border-slate-500/20 backdrop-blur-lg" : 
        "h-32 border-transparent"
    }

    duration-300
`

export const ChartAndTradeLayout = tw.div`
    flex w-full h-full space-x-4
`
export const ChartLayout = tw.div`
    flex flex-col flex-1 h-full p-3
    rounded-lg bg-slate-800/60
`
export const TradeLayout = tw.div`
    flex flex-col w-64 h-full
`

export const BottomLayout = tw.div`
    flex w-full space-x-4
`
export const MyTradeLayout = tw.div`
    sticky top-56
    flex flex-col flex-1
`
export const CommunityLayout = tw.div`
    flex flex-col w-128 min-h-[10rem]
`

export const MarketListLayout = tw.div`
    sticky top-14 z-0
    flex flex-col w-96 h-[calc(100vh-8rem)] p-4 space-y-4
`

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
    [&>.list]:p-2 [&>.list]:rounded-lg [&>.list]:bg-slate-500/10
    [&>.list]:overflow-y-auto
`

export const MarketListItem = tw(Link)`
    flex shrink-0 items-center w-full h-12 px-2
    rounded-md hover:bg-slate-700/30 
    text-sm text-slate-200
    transition-colors

    [&>.change-color]:text-slate-200
    [&.rise>.change-color]:text-red-500 [&.fall>.change-color]:text-blue-500

    [&>.name]:flex [&>.name]:flex-col [&>.name]:flex-1
    [&>.name>span]:truncate
    [&>.name>.korean]:text-sm [&>.name>.korean]:text-slate-200
    [&>.name>.english]:text-[10px] [&>.name>.english]:text-slate-400 [&>.name>.english]:font-extralight

    [&>.price]:flex [&>.price]:flex-col [&>.price]:w-24
    [&>.price>.volume]:text-[11px] [&>.price>.volume]:text-slate-400 [&>.price>.volume]:font-extralight

    [&>.change]:flex [&>.change]:flex-col [&>.change]:w-12
    [&>.change>.rate]:text-sm 
    [&>.change>.price]:text-[10px] [&>.change>.price]:font-extralight
`

export const MainTitleBox = tw.div`
    flex items-center space-x-1

    [&>.image]:relative [&>.image]:flex [&>.image]:flex-center [&>.image]:w-[28px] [&>.image]:aspect-square

    [&>.title]:text-3xl [&>.title]:text-slate-50 [&>.title]:font-semibold

    [&>.info]:flex [&>.info]:flex-col
    [&>.info>.english]:text-sm [&>.info>.english]:text-slate-400
    [&>.info>.code]:text-[10px] [&>.info>.code]:text-slate-500
`

export const MainPriceBox = tw.div`
    flex items-baseline space-x-2
    divide-x divide-slate-700
    text-slate-200
    [&.rise]:text-red-500 [&.fall]:text-blue-500

    [&>.price]:text-2xl [&>.price>.currency]:text-sm
    [&>.change]:flex [&>.change]:items-baseline [&>.change]:pl-2 [&>.change]:space-x-1
    [&>.change>.rate]:text-lg
    [&>.change>.price]:text-lg [&>.change>.price>.currency]:text-xs [&>.change>.price]:font-light
`

export const MainPriceInfoGrid = tw.div`
    grid grid-cols-2 gap-3

    [&>div]:flex [&>div]:justify-between [&>div]:items-center [&>div]:w-full
    [&>div>.label]:w-20 [&>div>.label]:text-sm [&>div>.label]:text-slate-400 [&>div>.label]:font-light
    [&>div>.value]:text-slate-300 [&>div>.value]:text-right
    [&>div>.value.rise]:text-red-500 [&>div>.value.fall]:text-blue-500
`
