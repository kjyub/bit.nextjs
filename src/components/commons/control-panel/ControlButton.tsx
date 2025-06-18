import { cn } from "@/utils/StyleUtils";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}
export default function ControlButton({ className, children, ...props }: Props) {
  return (
    <button 
      type="button"
      className={cn([
        'w-fit px-12 py-4 ml-auto',
        'rounded-full bg-slate-300/10 active:bg-slate-400/20 hover:bg-slate-400/20',
        'text-slate-200/80 border border-slate-500/50 transition-colors',
        className
      ])} 
      {...props}
    >
      {children}
    </button>
  )
}