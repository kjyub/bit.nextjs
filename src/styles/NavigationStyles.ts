import tw from 'tailwind-styled-components'

export const Layout = tw.div`
    sticky top-0 z-40 
    flex justify-center items-center w-screen h-14 p-4
    border-b border-slate-800
    bg-slate-900 backdrop-blur
    duration-300

    [&>.content]:flex [&>.content]:justify-between [&>.content]:items-center [&>.content]:w-full
    [&>.content]:max-w-(--breakpoint-xl)
`

export const Section = tw.div`
    flex items-center space-x-2
    text-slate-300

    [&>.btn]:flex [&>.btn]:justify-center [&>.btn]:items-center [&>.btn]:px-3 [&>.btn]:py-3 [&>.btn]:space-x-1
    [&>.btn]:rounded-lg [&>.btn]:hover:bg-white/10
    [&>.btn]:text-slate-300/70 [&>.btn]:hover:text-slate-100 [&>.btn]:font-semibold
    [&>.btn.active]:text-slate-100
    [&>.btn]:transition-colors [&>.btn]:select-none
    [&>.btn>i]:text-xs
`
