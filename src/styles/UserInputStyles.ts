import { StyleProps } from "@/types/StyleTypes"
import tw from "tailwind-styled-components"

export const Layout = tw.div`
    flex flex-col w-full space-y-1
`
export const Label = tw.label`
    text-sm text-slate-600 dark:text-slate-300
`
export const HelpText = tw.label`
    text-xs text-slate-500 dark:text-slate-400 font-light
`

export const InputColor = tw.div`
    border-slate-200 dark:border-slate-600
    bg-slate-100 dark:bg-slate-700
    text-slate-800 dark:text-slate-100
    [&>.value]:text-slate-800 [&>.value]:dark:text-slate-100
    disabled:bg-slate-200 dark:disabled:bg-slate-600
    [&>.value]:disabled:text-slate-600 [&>.value]:dark:disabled:text-slate-300
`

export const InputContainer = tw.div`
    relative
    flex items-center w-full h-12 space-x-2
`
export const InputBox = tw(InputColor)`
    flex items-center justify-between w-full h-full p-4
    rounded-lg 

    ${({$is_active}: StyleProps) => $is_active ? "border-2 !border-indigo-500" : "border"}
    ${({$is_error}: StyleProps) => $is_error ? "border-red-500" : ""}
    duration-200
`
export const Input = tw.input`
    w-full bg-transparent
`

export const Suffix = tw.span`
    absolute right-3
    text-slate-400
`
export const FeatureButton = tw.button`
    flex-shrink-0
    flex flex-center h-full p-4
    rounded-lg border 
    border-indigo-500 text-indigo-500
    disabled:border-slate-600 disabled:text-slate-600
`
export const ErrorMessage = tw.span`
    absolute -bottom-5 right-0
    w-full
    text-xs text-red-500
`

export const BoolInput = tw.div`
    grid grid-cols-2 gap-4 w-full h-full
`
export const BoolButton = tw(InputColor)`
    flex flex-center w-full
    rounded-lg border

    ${({$is_active}: StyleProps) => $is_active ? 
        `
        border-indigo-200 dark:border-indigo-600
        bg-indigo-100 dark:bg-indigo-700
        text-indigo-800 dark:text-indigo-100
        ` : 
        `
        border-slate-200 dark:border-slate-600
        bg-slate-100 dark:bg-slate-700
        text-slate-800 dark:text-slate-100
        `
    }
`

export const Combo = tw(InputBox)`
`
export const OptionBox = tw(InputColor)`
    absolute z-10 top-14 -left-2
    flex flex-col w-full max-h-[12rem] p-2 space-y-1
    rounded-lg border 
    overflow-y-auto

    [&>option]:flex [&>option]:items-center [&>option]:flex-shrink-0 [&>option]:px-2 [&>option]:py-1 
    [&>option]:rounded-lg hover:[&>option]:bg-slate-200 dark:hover:[&>option]:bg-slate-600
    [&>option]:text-slate-800 [&>option]:dark:text-slate-100
`