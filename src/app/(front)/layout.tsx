import Header from '@/components/commons/Header';
import MobileGNB from '@/components/commons/MobileGNB';
import type React from 'react';

export default function FrontLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <MobileGNB />
    </>
  );
}
