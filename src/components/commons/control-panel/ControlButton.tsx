import { cn } from '@/utils/StyleUtils';

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
        'rounded-2xl bg-surface-common-background active:bg-surface-common-background-active hover:bg-surface-common-background-active',
        'text-surface-main-text/80 border border-surface-common-border transition-colors',
        className,
      ])}
      {...props}
    >
      {children}
    </button>
  );
}
