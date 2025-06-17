import useSwipeDown from '@/hooks/useSwipeDown';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/utils/StyleUtils';
import { usePathname } from 'next/navigation';

export default function MobileMenu({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
  const pathname = usePathname();
  const ref = useSwipeDown(() => setIsOpen(false));
  const { isAuth, signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  }

  return (
    <div 
      className={cn([
        'mouse:hidden touch:fixed inset-0 z-50 size-full bg-slate-900/40 backdrop-blur-md',
        'p-8 pb-24',
        'transition-all duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      ])}
      ref={ref}
    >
      <div 
        className={cn([
          'flex flex-col justify-between size-full gap-4',
          isOpen ? 'translate-y-0' : 'translate-y-24',
          'duration-200'
        ])}
      >
        <h1 className="text-2xl font-light text-transparent">메뉴</h1>

        {!isAuth && (
          <span className="w-full text-center font-light text-slate-300/80">사용할 수 있는 메뉴가 없습니다.</span>
        )}

        <div className="flex flex-col w-full" onTouchMove={(e) => {e.stopPropagation();}} onTouchStart={(e) => {e.stopPropagation();}}>
          {isAuth && (
            <button
              type="button"
              className="w-fit px-12 py-4 ml-auto rounded-full bg-slate-400/10 active:bg-slate-400/20 text-slate-300/80 border border-slate-500/50 transition-colors"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </div>
  )
}