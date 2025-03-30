import { cn } from '@/utils/StyleUtils'

interface IModalLayout {
  title: string
  layoutClassName?: string
  contentClassName?: string
  children: React.ReactNode
}
export default function ModalLayout({ title, layoutClassName = 'w-96', contentClassName, children }: IModalLayout) {
  return (
    <div
      className={cn(
        'flex flex-col [&>div]:w-full [&>div]:p-6 [&>div]:bg-slate-700/50 backdrop-blur-xl',
        layoutClassName,
      )}
    >
      {/* 헤더 */}
      <div className="flex items-center h-16 rounded-t-xl border-b border-slate-700/50">
        <span className="text-xl font-medium text-slate-200">{title}</span>
      </div>
      {/* 내용 */}
      <div className={`flex flex-col !pb-5 rounded-b-xl ${contentClassName}`}>{children}</div>
    </div>
  )
}
