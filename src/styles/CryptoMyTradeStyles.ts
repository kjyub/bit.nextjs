import { StyleProps } from "@/types/StyleTypes"
import Link from "next/link"
import tw from "tailwind-styled-components"

export const Layout = tw.div`
    flex flex-col w-full h-[calc(100vh-208px)] space-y-2
`
export const PageTabBar = tw.div`
    flex items-center w-full px-1 space-x-1

    [&>button]:px-2 [&>button]:py-1
    [&>button]:text-sm [&>button]:text-slate-300/70 [&>button]:hover:text-slate-300
    [&>button.active]:text-slate-200 [&>button.active]:bg-slate-500/40
    [&>button]:rounded-lg
    [&>button]:duration-200
`

export const PageLayout = tw.div<StyleProps>`
    flex flex-col w-full h-full min-h-[12rem]
    rounded-lg bg-slate-900/30
`
export const PageList = tw.div<StyleProps>`
    ${({$is_active}) => $is_active ? "opacity-100" : "opacity-50"}
    flex flex-col w-full h-full space-y-2
    overflow-y-auto
    duration-200
`

export const ItemBox = tw.div`
    flex flex-col w-full p-2
    rounded-lg bg-slate-600/20
`

export const PositionBox = tw(ItemBox)`
    p-3 space-y-3

    [&>.header]:flex [&>.header]:justify-between [&>.header]:items-center [&>.header]:space-x-2
    [&>.header>.position]:w-16 [&>.header>.position]:px-2 [&>.header>.position]:py-1
    [&>.header>.position]:rounded-md [&>.header>.position]:text-sm [&>.header>.position]:text-white
    [&>.header>.position.long]:bg-position-long-1 [&>.header>.position.short]:bg-position-short-1
`
export const PositionHeader = tw.div`
    flex justify-between items-center space-x-2

    [&>.left]:flex [&>.left]:items-center [&>.left]:space-x-2
    [&>.left>.position]:w-12 [&>.left>.position]:py-[1px]
    [&>.left>.position]:rounded-md [&>.left>.position]:text-center
    [&>.left>.position]:text-[11px] [&>.left>.position]:text-white
    [&>.left>.position.long]:bg-position-long-1 [&>.left>.position.short]:bg-position-short-1

    [&>.left>.title]:flex [&>.left>.title]:items-baseline [&>.left>.title]:space-x-1
    [&>.left>.title>.korean]:text-sm [&>.left>.title>.korean]:text-slate-200
    [&>.left>.title>.english]:text-xs [&>.left>.title>.english]:text-slate-400
    [&>.left>.title>.code]:text-xs [&>.left>.title>.code]:text-slate-500

    [&>.left>.price]:text-sm [&>.left>.price]:text-slate-400
    [&>.left>.price.rise]:text-red-500 [&>.left>.price.fall]:text-blue-500

    [&>.right]:flex [&>.right]:items-center [&>.right]:space-x-2
    [&>.right>.value]:px-2 [&>.right>.value]:py-0.5
    [&>.right>.value]:rounded-md [&>.right>.value]:bg-slate-600/50
    [&>.right>.value]:text-xs [&>.right>.value]:text-slate-300 [&>.right>.value]:font-medium
    [&>.right>button.value]:hover:bg-slate-600/70 [&>.right>button.value]:hover:text-slate-400
    [&>.right>button.value]:transition-colors
`
export const PositionBody = tw.div`
    grid grid-cols-4 gap-2 w-full
`
export const PositionItem = tw.dl`
    flex flex-col w-full space-y-1

    [&>dt]:text-xs [&>dt]:text-slate-400
    [&>dt>span]:text-slate-400/80 [&>dt>span]:font-light
    [&>dd]:text-sm [&>dd]:text-slate-300 [&>dd]:font-light
    [&.long>dd]:text-position-long-3  [&.short>dd]:text-position-short-3
`
export const PositionClose = tw.div`
    flex items-center w-full pt-2 space-x-3
    border-t border-violet-500/20

    [&>.title]:text-sm [&>.title]:text-violet-500 [&>.title]:font-medium

    [&>.buttons]:flex [&>.buttons]:items-center [&>.buttons]:space-x-1

    [&>.buttons>button]:px-2 [&>.buttons>button]:py-0.5
    [&>.buttons>button]:rounded-md [&>.buttons>button]:hover:bg-slate-600/50
    [&>.buttons>button]:text-sm [&>.buttons>button]:text-violet-400 [&>.buttons>button]:hover:text-violet-300
    [&>.buttons>button]:duration-200

    [&>.inputs]:grid [&>.inputs]:grid-cols-2 [&>.inputs]:gap-2 [&>.inputs]:flex-1
`


export const OrderBox = tw(ItemBox)`
    p-3 space-y-3

    [&>.header]:flex [&>.header]:justify-between [&>.header]:items-center [&>.header]:space-x-2
    [&>.header>.position]:w-16 [&>.header>.position]:px-2 [&>.header>.position]:py-1
    [&>.header>.position]:rounded-md [&>.header>.position]:text-sm [&>.header>.position]:text-white
    [&>.header>.position.long]:bg-position-long-1 [&>.header>.position.short]:bg-position-short-1
`
export const OrderHeader = tw.div`
    flex justify-between items-center space-x-2

    [&>.left]:flex [&>.left]:items-center [&>.left]:space-x-2
    [&>.left>.datetime]:w-[8.5rem]
    [&>.left>.datetime>i]:mr-1
    [&>.left>.datetime>i]:text-xs [&>.left>.datetime>i]:text-slate-400
    [&>.left>.datetime]:rounded-md [&>.left>.datetime]:text-left
    [&>.left>.datetime]:text-[13px] [&>.left>.datetime]:text-slate-300 [&>.left>.datetime]:font-light

    [&>.left>.title]:flex [&>.left>.title]:items-baseline [&>.left>.title]:space-x-1
    [&>.left>.title>.korean]:text-sm [&>.left>.title>.korean]:text-slate-200
    [&>.left>.title>.english]:text-xs [&>.left>.title>.english]:text-slate-400
    [&>.left>.title>.code]:text-xs [&>.left>.title>.code]:text-slate-500
    
    [&>.left>.position]:w-12 [&>.left>.position]:py-[1px]
    [&>.left>.position]:rounded-md [&>.left>.position]:text-center
    [&>.left>.position]:text-[11px] [&>.left>.position]:text-white
    [&>.left>.position.long]:bg-position-long-1 [&>.left>.position.short]:bg-position-short-1

    [&>.left>.price]:text-sm [&>.left>.price]:text-slate-400
    [&>.left>.price.rise]:text-red-500 [&>.left>.price.fall]:text-blue-500

    [&>.right]:flex [&>.right]:items-center [&>.right]:space-x-2
    [&>.right>.value]:px-2 [&>.right>.value]:py-0.5
    [&>.right>.value]:rounded-md [&>.right>.value]:bg-slate-600/50
    [&>.right>.value]:text-xs [&>.right>.value]:text-slate-300 [&>.right>.value]:font-medium
    [&>.right>button.value]:hover:bg-slate-600/70 [&>.right>button.value]:hover:text-slate-400

    [&>.right>.position]:text-xs 
    [&>.right>.position.long]:text-position-long-2 [&>.right>.position.short]:text-position-short-2
`
export const OrderBody = tw.div`
    grid grid-cols-4 gap-2 w-full
`
export const OrderItem = tw.dl`
    flex flex-col w-full space-y-1

    [&>dt]:text-xs [&>dt]:text-slate-400
    [&>dt>span]:text-slate-400/80 [&>dt>span]:font-light
    [&>dd]:text-sm [&>dd]:text-slate-300 [&>dd]:font-light
    [&.long>dd]:text-position-long-3  [&.short>dd]:text-position-short-3
`
export const OrderClose = tw.div`
    flex items-center w-full pt-2 space-x-3
    border-t border-violet-500/20

    [&>.title]:text-sm [&>.title]:text-violet-500 [&>.title]:font-medium

    [&>.buttons]:flex [&>.buttons]:items-center [&>.buttons]:space-x-1

    [&>.buttons>button]:px-2 [&>.buttons>button]:py-0.5
    [&>.buttons>button]:rounded-md [&>.buttons>button]:hover:bg-slate-600/50
    [&>.buttons>button]:text-sm [&>.buttons>button]:text-violet-400 [&>.buttons>button]:hover:text-violet-300
    [&>.buttons>button]:duration-200

    [&>.inputs]:grid [&>.inputs]:grid-cols-2 [&>.inputs]:gap-2 [&>.inputs]:flex-1
`

export const FilterBox = tw.div<StyleProps>`
    flex flex-center px-2 py-1
    rounded-md 
    text-xs

    ${({$is_active}) => $is_active ? 
        "bg-slate-500/30 text-slate-300 hover:text-slate-200" : 
        "text-slate-400 hover:bg-slate-500/30 hover:text-slate-200"
    }
    transition-colors
`
export const FilterButton = tw(FilterBox)`
    cursor-pointer
`
export const FilterDateInputBox = tw(FilterBox)`
    px-1 space-x-1 
    [&>input]:bg-transparent [&>input]:text-center 
    [&>input]:pt-[1px] 
    [&>input]:border-b [&>input]:border-transparent 
    [&>input]:focus:border-violet-500/70 [&>input]:hover:border-violet-500/70
    [&>input]:transition-colors
`