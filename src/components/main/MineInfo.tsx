'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/utils/StyleUtils';
import Link from 'next/link';

export default function MineInfo() {
  const { ref, inView } = useInView();

  return (
    <div className="flex max-md:flex-col-reverse md:flex-row w-full p-4 gap-4 group">
      <div className="flex flex-col justify-center max-md:items-center flex-1 h-56 max-md:px-2 md:px-12 gap-2">
        <p
          ref={ref}
          className={cn(['text-2xl md:text-3xl font-bold text-slate-50', { 'animate-fade-blur-down': inView }])}
        >
          돈을 잃어도 걱정하지마세요
        </p>
        <p className="max-md:text-lg md:text-xl text-slate-200 max-md:text-center">
          지하 노역장에서 새로운 삶을 찾을 수 있습니다
        </p>
        <p className="text-xs text-slate-500/70">파산 시 언제나 이용가능합니다</p>
      </div>

      <Link
        href="/mine"
        className="relative flex flex-center md:aspect-square max-md:h-40 md:h-56 rounded-4xl md:bg-slate-600/10 touch:active:bg-slate-500/10 transition-colors select-none"
      >
        <i className="fa-solid fa-hammer text-7xl text-slate-500 mouse:group-hover:rotate-20 group-active:rotate-20 mouse:group-hover:scale-y-90 group-active:scale-y-90 transition-transform duration-300"></i>
        <div
          className={cn([
            'absolute max-md:bottom-4 md:bottom-10 inset-x-0 w-fit px-2 py-1 mx-auto rounded-full bg-slate-500/30',
            'text-sm text-slate-300/70',
            'opacity-0 transition-all duration-300',
            'mouse:group-hover:opacity-100 mouse:group-hover:translate-y-2',
            'touch:group-active:opacity-100 touch:group-active:translate-y-2',
          ])}
        >
          바로가기
        </div>
      </Link>
    </div>
  );
}
