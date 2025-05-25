'use client';

import CryptoMain from '@/components/cryptos/CryptoMain';
import { DEFAULT_MARKET_CODE } from '@/constants/CryptoConsts';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CryptoMainPage() {
  const { isAuth } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push(`/crypto/${DEFAULT_MARKET_CODE}`);
    }
  }, [isAuth]);

  if (!isAuth) {
    return <div>로딩중</div>;
  }

  return <CryptoMain />;
}
