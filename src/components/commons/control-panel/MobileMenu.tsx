import { useUser } from '@/hooks/useUser';
import { cn } from '@/utils/StyleUtils';
import { use, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ControlButton from './ControlButton';
import MessageList from './MessageList';
import ChartColorButton from './ChartColorButton';
import { UiContext } from '@/store/providers/UiProvider';

const SWIPE_DOWN_THRESHOLD = 75;

// 추후에 로그 메세지 같은거 넣기

const Layout = ({ isOpen, setIsOpen, children }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, children: React.ReactNode }) => {
  const [translateY, setTranslateY] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(100);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const startY = useRef<number>(0);

  // 브라우저 스크롤 막기
  useLayoutEffect(() => {
    if (isOpen) {
      setTranslateY(0);
      setOpacity(100);
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
    requestAnimationFrame(() => {
      const currentY = e.touches[0].clientY;
      let deltaY = currentY - startY.current;
      if (deltaY > SWIPE_DOWN_THRESHOLD) {
        deltaY = SWIPE_DOWN_THRESHOLD;
      } else if (deltaY < 0) {
        deltaY = 0;
      }
      setTranslateY(deltaY);
      setOpacity(100 - (deltaY / SWIPE_DOWN_THRESHOLD) * 90);
    })
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - startY.current;
    if (deltaY > SWIPE_DOWN_THRESHOLD) {
      setIsOpen(false);
    } else {
      setTranslateY(0);
      setOpacity(100);
    }
    setIsSwiping(false);
  }
  
  return (
    <div 
      className={cn([
        'mouse:hidden touch:fixed inset-0 z-50 size-full bg-slate-900/40 backdrop-blur-xl',
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
          'will-change-transform will-change-opacity'
        ])}
        style={{ transform: `translateY(${translateY}px)`, opacity: `${opacity}%` }}
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
  const { chartColor, setChartColor } = use(UiContext);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  }

  return (
    <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
      <h1 className="mb-8 text-2xl font-light text-slate-200/80 font-sinchon-rhapsody">KURRITO</h1>

      <MessageList ref={usePreventSwipe()} isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="flex justify-between items-end">
        <div className="flex flex-col justify-end gap-1">
          <span className="text-xs text-slate-200/80">차트 색상</span>
          <div className="flex flex-1 gap-1">
            <ChartColorButton
              riseColor="red"
              fallColor="blue"
              className="h-9"
              isActive={chartColor === "red-blue"}
              onClick={() => setChartColor("red-blue")}
            />
            <ChartColorButton
              riseColor="green"
              fallColor="red"
              className="h-9"
              isActive={chartColor === "green-red"}
              onClick={() => setChartColor("green-red")}
            />
          </div>
        </div>
        {isAuth && (
          <ControlButton onClick={handleLogout} className="px-6 h-10">
            로그아웃
          </ControlButton>
        )}
      </div>
    </Layout>
  )
}