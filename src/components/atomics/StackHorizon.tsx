'use client';

import { useDetectClose } from '@/hooks/useDetectClose';
import { cn } from '@/utils/StyleUtils';

export interface StackHorizonItem {
  content: string;
  ratio: number; // 0 ~ 100
  color: string;
}

interface Props {
  className?: string;
  items: StackHorizonItem[];
  others: StackHorizonItem[];
}
export default function StackHorizon({ className, items, others }: Props) {
  return (
    <div
      className={cn([
        'flex w-full min-h-[34px] p-1 gap-1 rounded-full bg-slate-700/60 first:pl-1.875 last:pr-1.875',
        className,
      ])}
    >
      {items.map((item, index) => (
        <StackHorizonItem
          key={index}
          item={item}
          tooltip={
            <Tooltip>
              <div className="flex items-center gap-1">
                <i className="fa-solid fa-circle text-[8px]" style={{ color: item.color }}></i>
                {item.content}
              </div>
            </Tooltip>
          }
        >
          {item.content}
        </StackHorizonItem>
      ))}
      {others.length > 0 && (
        <StackHorizonItem
          item={others[0]}
          tooltip={
            <Tooltip>
              {others.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <i className="fa-solid fa-circle text-[8px]" style={{ color: item.color }}></i>
                  {item.content}
                </div>
              ))}
            </Tooltip>
          }
        >
          더 보기
        </StackHorizonItem>
      )}
    </div>
  );
}

const StackHorizonItem = ({
  item,
  tooltip,
  children,
}: { item: StackHorizonItem; tooltip: React.ReactNode; children: React.ReactNode }) => {
  const [ref, isOpen, setIsOpen] = useDetectClose<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn([
        'relative flex justify-center px-0.125',
        { '[&>.tooltip]:opacity-100 [&>.tooltip]:translate-y-0 [&>.tooltip]:pointer-events-auto': isOpen },
        { '[&>.tooltip]:opacity-0 [&>.tooltip]:translate-y-2 [&>.tooltip]:pointer-events-none': !isOpen },
      ])}
      style={{ width: `${item.ratio}%` }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {tooltip}
      <div
        className="flex justify-center w-full px-2 py-1 text-xs text-slate-200/80 border border-slate-500/30 rounded-full"
        style={{ backgroundColor: item.color }}
      >
        <div className="truncate">{children}</div>
      </div>
    </div>
  );
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={cn(['tooltip absolute z-10 bottom-8 right-0', 'flex justify-center w-full', 'duration-300'])}>
      <div
        className={cn([
          'flex flex-col items-center min-w-24 w-fit p-2 gap-2 rounded-xl bg-slate-400/30 backdrop-blur-md',
          'text-xs text-slate-200/80',
          'border border-slate-500/30',
        ])}
      >
        {children}
      </div>
    </div>
  );
};
