import { cn } from '@/utils/StyleUtils';

interface IModalLayout {
  title: string;
  layoutClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}
export default function ModalLayout({ title, layoutClassName = 'w-96', contentClassName, children }: IModalLayout) {
  return (
    <div
      className={cn(
        'flex flex-col [&>div]:w-full [&>div]:p-6 modal-panel backdrop-blur-lg overflow-hidden',
        layoutClassName,
      )}
    >
      {/* 헤더 */}
      <div className="flex items-center h-16 rounded-t-xl border-x border-t border-surface-modal-border">
        <span className="text-xl font-medium text-surface-main-text">{title}</span>
      </div>
      {/* 내용 */}
      <div className={`flex flex-col !pb-5 rounded-b-xl border border-surface-modal-border ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
