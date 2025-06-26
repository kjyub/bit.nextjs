'use client';

import { cn } from "@/utils/StyleUtils";
import { useParams, usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";

export default function CryptoClientLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const currentCode = params?.code || 'KRW-BTC';
  const pathname = usePathname();
  const [mode, setMode] = useState<'wide' | 'compact'>('wide');

  useLayoutEffect(() => {
    if (pathname === `/crypto/${currentCode}`) {
      setMode('wide');
    } else {
      setMode('compact');
    }

    window.scrollTo(0, 0);
  }, [pathname, currentCode])

  return (
    <div className={cn(['group/crypto relative flex flex-col justify-center max-sm:min-w-64 sm:min-w-128 max-xl:w-full', mode])}>
      {children}
    </div>
  )
}