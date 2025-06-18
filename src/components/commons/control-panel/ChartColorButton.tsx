import { cn } from "@/utils/StyleUtils";

type ColorType = 'red' | 'blue' | 'green';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isActive: boolean;
  riseColor: ColorType;
  fallColor: ColorType;
  children?: React.ReactNode;
}
export default function ChartColorButton({ className, isActive, riseColor, fallColor, children, ...props }: Props) {
  return (
    <button
      type="button"
      {...props}
      className={cn([
        'flex items-center px-3 gap-2',
        'rounded-2xl bg-slate-500/10 active:bg-slate-400/20 hover:bg-slate-400/20',
        'text-sm text-slate-200/80 border border-slate-500/50 transition-colors',
        { 'bg-slate-400/20 border-violet-500': isActive },
        className
      ])}
    >
      <div
        className={cn([
          'flex items-center gap-1',
          { 'text-position-red-strong': fallColor === 'red' },
          { 'text-position-blue-strong': fallColor === 'blue' },
          { 'text-position-green-strong': fallColor === 'green' },
        ])}
      >
        <i className="fa-solid fa-arrow-down"></i>
      </div>
      <div
        className={cn([
          'flex items-center gap-1',
          { 'text-position-red-strong': riseColor === 'red' },
          { 'text-position-blue-strong': riseColor === 'blue' },
          { 'text-position-green-strong': riseColor === 'green' },
        ])}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </div>
    </button>
  )
}