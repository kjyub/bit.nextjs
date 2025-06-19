import { cn } from '@/utils/StyleUtils';
import { useRef, useState } from 'react';
import './style.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: () => void;
  className?: string;
}
export default function ExitButton({ action, className, ...props }: Props) {
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartHolding = () => {
    setIsHolding(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      action();
    }, 1000);
  };

  const handleStopHolding = () => {
    setIsHolding(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  return (
    <button
      type="button"
      className={cn([
        'relative flex justify-end items-center gap-1 h-8 rounded-lg bg-stone-700 text-stone-300 duration-200',
        { 'holding scale-95 w-24': isHolding },
        { 'w-18': !isHolding },
        className,
      ])}
      onMouseDown={handleStartHolding}
      onMouseUp={handleStopHolding}
      onMouseLeave={handleStopHolding}
      onTouchStart={handleStartHolding}
      onTouchEnd={handleStopHolding}
      onTouchCancel={handleStopHolding}
    >
      <span className="absolute left-4 whitespace-nowrap font-medium">
        나가기
      </span>

      {isHolding && (
        <div className="relative w-6 h-6 mr-2.5">
          <svg viewBox="0 0 36 36" className="absolute top-0 left-0 w-full h-full">
          <circle
            className="stroke-bg"
            cx="18"
            cy="18"
            r="16"
            fill="none"
          />
          <circle
            className="stroke-ring"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            />
          </svg>
        </div>
      )}
    </button>
  );
}