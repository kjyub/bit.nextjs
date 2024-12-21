import { StyleProps } from "@/types/StyleTypes"
import Link from "next/link"
import tw from "tailwind-styled-components"
import styled from "styled-components"

export const TradeBox = tw.div`
    flex flex-col w-full h-full space-y-3
`

export const HelpBox = tw.div`
    relative
    flex flex-center aspect-square h-5
    text-slate-400 hover:text-slate-300
    transition-colors cursor-pointer

    [&>div]:absolute [&>div]:-z-10 [&>div]:bottom-8 [&>div]:right-0
    [&>div]:opacity-0 [&>div.show]:opacity-100 [&>div.show]:z-50 [&>div]:transition-opacity
    [&>div]:flex [&>div]:flex-col [&>div]:space-y-2
    [&>div]:w-64 [&>div]:px-2 [&>div]:py-1.5 [&>div]:rounded [&>div]:bg-slate-700
    [&>div]:text-slate-300 [&>div]:text-xs
`

export const Title = tw.span`
    text-sm text-slate-300
`
export const Title2 = tw.span`
    text-sm text-slate-400 font-light
`

export const InputBox = tw.div<StyleProps>`
    flex items-center w-full h-7 p-2
    rounded-lg bg-slate-500/20
    focus-within:ring-1 focus-within:ring-violet-500
    [&>.input]:text-sm [&>.input]:text-slate-300 [&>.input]:bg-transparent
    [&>.input]:outline-none focus:[&>.input]:outline-none

    ${({ $is_focus }) => $is_focus ? "ring-1 ring-violet-500" : ""}
    duration-200
`

export const MarginModeBox = tw.div`
    relative
    flex items-center w-full h-full
    text-sm

    [&>*]:duration-300
    [&>button]:z-20 [&>button]:w-1/2 [&>button]:h-full [&>button]:space-x-2
    [&>button]:text-slate-400 [&>button.active]:text-slate-100

    [&>.thumb]:absolute [&>.thumb]:z-10 [&>.thumb]:top-0 [&>.thumb]:left-0 [&>.thumb.right]:left-1/2
    [&>.thumb]:w-1/2 [&>.thumb]:h-full
    [&>.thumb]:rounded-full [&>.thumb]:bg-violet-600

    [&>.bg]:w-full [&>.bg]:h-full
    [&>.bg]:rounded-full [&>.bg]:bg-transparent
    [&>.bg.active]:bg-slate-700/50
    [&>.bg.active]:w-[calc(100%+0.5rem)] [&>.bg.active]:h-[calc(100%+0.5rem)]
`

export const SliderBox = tw.div`
    relative
    flex items-center w-full
`
export const Slider = styled(SliderBox)`
    input[type="range"] {
        -webkit-appearance: none; /* 기본 스타일 제거 */
        width: 100%; /* 원하는 넓이 설정 */
        height: 16px; /* 높이는 thumb 크기와 일치 */
        background: transparent; /* 기본 배경 제거 */
        position: relative;
        z-index: 10;
    }

    /* Track 스타일 */
    input[type="range"]::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        background: transparent;
    }

    input[type="range"]::-moz-range-track {
        background: transparent;
    }

    input[type="range"]::-ms-track {
        background: transparent;
        border-color: transparent;
        color: transparent;
    }

    /* Thumb 스타일 */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none; /* 기본 스타일 제거 */
        width: 16px;
        height: 16px;
        background: #7c3aed; /* 보라색 */
        border-radius: 50%; /* 원형 */
        cursor: pointer;
        margin-top: 0px; /* 중앙 맞추기 */
    }

    input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: #7c3aed;
        border: none;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-ms-thumb {
        width: 16px;
        height: 16px;
        background: #7c3aed;
        border: none;
        border-radius: 50%;
        cursor: pointer;
    }
`
export const SliderBar = tw.div`
    absolute top-1/2 translate-y-[calc(-50%)] z-0
    w-full h-[1px]
    border-t border-slate-600
`
export const SliderMark = tw.div`
    absolute top-0 -translate-x-[1px] z-0
    border-x border-slate-600
    w-[1px] h-4
`

export const OrderTypeBox = tw.div`
    flex items-center w-full h-full
    text-sm

    [&>*]:duration-300
    [&>button]:z-20 [&>button]:w-1/2 [&>button]:h-full [&>button]:space-x-2
    [&>button]:text-slate-500/80 hover:[&>button]:text-slate-400
    [&>button.active]:text-violet-500 hover:[&>button.active]:text-violet-500 [&>button.active]:font-semibold
`

const TradeButton = tw.button`
    w-full h-10
    rounded-lg
    text-white font-medium
    transition-colors
`
export const TradeLongButton = tw(TradeButton)`
    bg-[#ad2c2c] hover:bg-[#c43a3a]
`
export const TradeShortButton = tw(TradeButton)`
    bg-[#2d5ab9] hover:bg-[#3b69cb]
`

export const SummaryItem = tw.div`
    flex justify-between items-center w-full
    [&>.label]:text-xs [&>.label]:text-slate-500
    [&>.value]:text-sm [&>.value]:text-slate-400
`