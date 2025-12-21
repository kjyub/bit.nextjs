'use client';

import { useConstrainedAbsolutePosition } from '@/hooks/useConstrainedAbsolutePosition';
import { useDetectClose } from '@/hooks/useDetectClose';
import { cn } from '@/utils/StyleUtils';

export interface StackHorizonItem {
  content: string;
  ratio: number; // 0 ~ 100
  widthRatio: number; // 0 ~ 100
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
        'relative flex items-center w-full min-h-[34px] px-1 py-1.25 gap-1 rounded-full bg-surface-sub-background',
        className,
      ])}
    >
      <div className="flex w-full h-full">
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
    </div>
  );
}

const StackHorizonItem = ({
  item,
  tooltip,
  children,
}: { item: StackHorizonItem; tooltip: React.ReactNode; children: React.ReactNode }) => {
  const [ref, isOpen, setIsOpen] = useDetectClose<HTMLDivElement>();
  const constrainedRef = useConstrainedAbsolutePosition();

  return (
    <div
      ref={ref}
      className={cn([
        'relative @container flex justify-center',
        { '[&>.tooltip]:opacity-100 [&>.tooltip]:translate-y-0 [&>.tooltip]:pointer-events-auto': true },
        { '[&>.tooltip]:opacity-0 [&>.tooltip]:translate-y-2 [&>.tooltip]:pointer-events-none': !isOpen },
      ])}
      style={{ width: `${item.widthRatio}%` }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="@max-[26px]:hidden @min-[27px]:flex justify-center w-full h-full">
        <div
          className="flex justify-center items-center h-full text-xs text-surface-sub-text border border-surface-sub-border rounded-full"
          style={{ width: 'calc(100% - 0.25rem)', backgroundColor: item.color }}
        >
          <div className="truncate">{children}</div>
        </div>
      </div>
      <div className="@max-[26px]:flex @min-[27px]:hidden flex-center w-full h-full">
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
      </div>

      <div
        ref={constrainedRef}
        className={cn(['tooltip absolute z-10 bottom-8 inset-x-0', 'flex justify-center', 'duration-300'])}
      >
        {tooltip}
      </div>
    </div>
  );
};

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={cn([
        'flex flex-col items-center min-w-24 w-fit p-2 gap-2 rounded-xl bg-white/15 backdrop-blur-md',
        'text-xs text-white/80',
        'border border-white/17',
      ])}
    >
      {children}
    </div>
  );
};
