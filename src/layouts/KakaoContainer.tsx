'use client';

import type React from 'react';
import { useEffect } from 'react';

export default function KakaoContainer({ children }: { children: React.ReactNode }) {
  // 카카오
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { Kakao } = window;
      console.log('KakaoContainer', Kakao);

      if (Kakao && !Kakao.isInitialized()) {
        initKakao();
      } else if (!Kakao) {
        setTimeout(() => {
          initKakao();
        }, 1000);
      }
    }
  }, []);

  const initKakao = () => {
    const { Kakao } = window;
    Kakao.init(process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID);
  };

  return <>{children}</>;
}
