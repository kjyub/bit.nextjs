'use client';

import { useLayoutEffect } from 'react';

export default function MineLayout({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    document.body.classList.add('mine');
    return () => {
      document.body.classList.remove('mine');
    };
  }, []);

  return children;
}