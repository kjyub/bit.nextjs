import tw from "tailwind-styled-components"

const Button = tw.button`
    px-3 py-1 
    rounded-md bg-slate-500/50 hover:bg-slate-500/70
    text-sm text-slate-300 
    transition-colors
`

interface CommonButtonProps {
    children?: React.ReactNode
    onClick: () => void
    className?: string
    disabled?: boolean
    type?: "button" | "submit" | "reset"
    style?: React.CSSProperties
}
export default function CommonButton({
    children,
    onClick,
    className = "",
    disabled = false,
    type = "button",
    style = {},
    ...props
}: CommonButtonProps) {
    return (
        <Button
            type={type}
            onClick={onClick}
            className={`${className}`}
            disabled={disabled}
            style={style}
            {...props}
        >
            {children}
        </Button>
    )
}