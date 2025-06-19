import { useInView } from '@/hooks/useInView';
import { cn } from '@/utils/StyleUtils';
import { useEffect, useRef, useState } from 'react';

export default function MineTitle() {
  const { ref, inView } = useInView();
  const [isHammerMotion, setIsHammerMotion] = useState(false);
  const hammerMotionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inView) {
      hammerMotionTimerRef.current = setTimeout(() => {
        setIsHammerMotion(true);

        setTimeout(() => {
          setIsHammerMotion(false);
        }, 500);

        hammerMotionTimerRef.current = null;
      }, 1000);
    } else {
      if (hammerMotionTimerRef.current) {
        clearTimeout(hammerMotionTimerRef.current);
      }
    }
  }, [inView]);

  return (
    <div className="flex flex-col w-full gap-4">
      <div ref={ref} className="flex flex-col flex-center w-full max-md:aspect-square md:aspect-[4/3] gap-4">
        <h1
          className={cn([
            'text-stone-200 max-md:text-5xl md:text-6xl font-bold',
            { 'opacity-100 animate-fade-blur-down': inView },
            { 'opacity-0': !inView },
            'transition-all duration-1000'
          ])}
        >
          <i className={cn([
            'fa-solid fa-hammer mr-4',
            { 'animate-hammer-motion': isHammerMotion },
            { 'animate-none': !isHammerMotion },
          ])}></i>
          지하 노역장
        </h1>
        <h2 
          className={cn([
            'flex flex-wrap justify-center text-stone-400 max-md:text-sm md:text-lg gap-1',
            { 'opacity-100': inView },
            { 'opacity-30': !inView },
            'transition-all duration-1000'
          ])}
        >
          <span>여기서 다시 희망을 향해 나아가세요.</span>
          <span>노역장이 당신을 도와드리겠습니다.</span>
        </h2>
      </div>
    </div>
  )
}