import Navigation from '@/components/commons/Navigation';
import React from 'react';

export default function FrontLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
