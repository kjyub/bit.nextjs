import { StyleProps } from "@/types/StyleTypes"
import Link from "next/link"
import tw from "tailwind-styled-components"

export const Layout = tw.div`
    flex flex-col flex-1 max-w-[800px] py-12 space-y-4
`

export const WalletLayout = tw.div`
    flex flex-col w-full h-72 p-4 space-y-4
    rounded-xl
    border border-slate-500/70
`

export const WalletBox = tw.div`
    flex flex-col w-full h-full p-4 space-y-2
    rounded-xl

    [&>.header]:flex [&>.header]:justify-between [&>.header]:items-center [&>.header]:w-full
    [&>.header>.title]:text-lg [&>.header>.title]:text-slate-300
    [&>.content]:flex [&>.content]:justify-between [&>.content]:items-center [&>.content]:w-full
    [&>.content>.label]:text-sm [&>.content>.label]:text-slate-300/70
    [&>.content>.value]:text-base [&>.content>.value]:text-slate-100
`

export const TransferTypeBox = tw.div`
    relative
    flex items-center w-full h-12
    text-sm

    [&>*]:duration-300
    [&>button]:z-20 [&>button]:w-1/2 [&>button]:h-full [&>button]:space-x-2
    [&>button]:text-slate-400 [&>button.active]:text-slate-100

    [&>.thumb]:absolute [&>.thumb]:z-10 [&>.thumb]:top-0 [&>.thumb]:left-0 [&>.thumb.right]:left-1/2
    [&>.thumb]:w-1/2 [&>.thumb]:h-full
    [&>.thumb]:rounded-full [&>.thumb]:bg-indigo-600

    [&>.bg]:w-full [&>.bg]:h-full
    [&>.bg]:rounded-full [&>.bg]:bg-transparent
    [&>.bg.active]:bg-slate-700/50
    [&>.bg.active]:w-[calc(100%+0.5rem)] [&>.bg.active]:h-[calc(100%+0.5rem)]
`

export const TransferInfoList = tw.div`
    flex flex-col w-full space-y-1
`
export const TransferInfoBox = tw.div`
    flex justify-between items-center w-full

    [&>.label]:text-sm [&>.label]:text-slate-300/70
    [&>.value]:text-base [&>.value]:text-slate-300
`
export const TransferButton = tw.button`
    w-48 h-11 ml-auto
    rounded-lg bg-indigo-600/90 hover:bg-indigo-700/90
    disabled:bg-slate-500/50 disabled:cursor-not-allowed
    text-base text-slate-200
    transition-colors
`