import { useUser } from '@/hooks/useUser';
import { cn } from '@/utils/StyleUtils';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const SWIPE_DOWN_THRESHOLD = 75;

// 추후에 로그 메세지 같은거 넣기

const Layout = ({ isOpen, setIsOpen, children }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, children: React.ReactNode }) => {
  const [translateY, setTranslateY] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const startY = useRef<number>(0);

  // 브라우저 스크롤 막기
  useLayoutEffect(() => {
    if (isOpen) {
      setTranslateY(0);
      startY.current = 0;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startY.current = e.touches[0].clientY;
    setIsSwiping(true);
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0].clientY;
    let deltaY = currentY - startY.current;
    if (deltaY > SWIPE_DOWN_THRESHOLD) {
      deltaY = SWIPE_DOWN_THRESHOLD;
    } else if (deltaY < 0) {
      deltaY = 0;
    }
    setTranslateY(deltaY);
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - startY.current;
    if (deltaY > SWIPE_DOWN_THRESHOLD) {
      setIsOpen(false);
    } else {
      setTranslateY(0);
    }
    setIsSwiping(false);
  }
  
  return (
    <div 
      className={cn([
        'mouse:hidden touch:fixed inset-0 z-50 size-full bg-slate-900/40 backdrop-blur-lg',
        'p-8 pb-16',
        'transition-all duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      ])}
    >
      <div 
        className={cn([
          'flex flex-col justify-between size-full gap-4',
          isOpen ? 'translate-y-0' : 'translate-y-24',
          isSwiping ? 'duration-0' : 'duration-300',
          'will-change-transform'
        ])}
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}

const usePreventSwipe = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('touchstart', (e) => {
        e.stopPropagation();
      });
      ref.current.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      });
      ref.current.addEventListener('touchend', (e) => {
        e.stopPropagation();
      });
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('touchstart', (e) => {e.stopPropagation();});
        ref.current.removeEventListener('touchmove', (e) => {e.stopPropagation();});
        ref.current.removeEventListener('touchend', (e) => {e.stopPropagation();});
      }
    }
  }, [ref])
  
  return ref
}

export default function MobileMenu({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
  const { isAuth, signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  }

  return (
    <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1 className="mb-16 text-2xl font-light text-slate-200/80 font-sinchon-rhapsody">KURRITO</h1>

      {!isAuth && (
        <span className="w-full text-center font-light text-slate-300/80">사용할 수 있는 메뉴가 없습니다.</span>
      )}

      <div ref={usePreventSwipe()} className="flex flex-col w-full flex-1 overflow-y-auto gap-2">
        <div className="w-full rounded-xl bg-slate-500/20 text-slate-200/80 p-4">테스트</div>
      </div>

      <div className="flex flex-col w-full">
        {isAuth && (
          <button
            type="button"
            className="w-fit px-12 py-4 ml-auto rounded-full bg-slate-300/10 active:bg-slate-400/20 text-slate-200/80 border border-slate-500/50 transition-colors"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        )}
      </div>
    </Layout>
  )
}