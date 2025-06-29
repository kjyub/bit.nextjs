'use client';

import { cn } from "@/utils/StyleUtils";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

const IconClassName = cn([
  'absolute m-auto',
  'text-5xl text-slate-500 -skew-6 mouse:group-hover:-skew-9 group-active:-skew-9 transition-transform duration-300'
])

export default function Flex() {
  const { ref, inView } = useInView();

  return (
    <div className="flex max-md:flex-col md:flex-row w-full p-4 gap-4 group">
      <Link 
        href="/flex" 
        className={cn([
          'relative flex flex-center md:aspect-square max-md:h-40 md:h-56 rounded-4xl md:bg-slate-600/10 touch:active:bg-slate-500/10 transition-colors select-none',
          'transition-colors group select-none',
        ])}
      >
        <i className={cn([IconClassName, 'fa-solid fa-money-bill translate-x-4 translate-y-4 mouse:group-hover:translate-x-6 mouse:group-hover:translate-y-6 group-active:translate-x-6 group-active:translate-y-6 opacity-100'])}></i>
        <i className={cn([IconClassName, 'fa-solid fa-money-bill opacity-90'])}></i>
        <i className={cn([IconClassName, 'fa-solid fa-money-bill-trend-up -translate-x-4 -translate-y-4 mouse:group-hover:-translate-x-6 mouse:group-hover:-translate-y-6 group-active:-translate-x-6 group-active:-translate-y-6 opacity-80'])}></i>
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

      <div className="flex flex-col justify-center max-md:items-center flex-1 h-56 max-md:px-2 md:px-12 gap-2">
        <p className="text-right text-2xl md:text-3xl font-bold text-slate-50">수익 인증</p>
        <p className="text-right max-md:text-lg md:text-xl text-slate-200 max-md:text-center">내 거래를 자랑해보세요</p>
      </div>
    </div>
  );
}