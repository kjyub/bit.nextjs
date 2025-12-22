import { cn } from '@/utils/StyleUtils';

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
        'rounded-2xl bg-surface-sub-background active:bg-surface-common-background-active hover:bg-surface-common-background-active',
        'text-sm text-surface-main-text/80 border border-surface-common-border transition-colors',
        { 'bg-surface-common-background-active border-violet-500': isActive },
        className,
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
        <i className="fa-solid fa-arrow-trend-down"></i>
      </div>
      <div
        className={cn([
          'flex items-center gap-1',
          { 'text-position-red-strong': riseColor === 'red' },
          { 'text-position-blue-strong': riseColor === 'blue' },
          { 'text-position-green-strong': riseColor === 'green' },
        ])}
      >
        <i className="fa-solid fa-arrow-trend-up"></i>
      </div>
    </button>
  );
}
