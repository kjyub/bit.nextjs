import { StyleProps } from "@/types/StyleTypes"
import tw from "tailwind-styled-components"

export const PageWidth = tw.div`
    max-w-screen-xl
`

export const PageLayout = tw.div`
    flex flex-col items-center w-screen
`

export const PageContent = tw(PageWidth)`
    flex flex-col w-full
`