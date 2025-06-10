'use client';

import CryptoMain from '@/components/cryptos/CryptoMain';
import CryptoMainNoneAuth from '@/components/cryptos/CryptoMainNoneAuth';
import { useUser } from '@/hooks/useUser';

export default function CryptoMainPage() {
  const { isAuth } = useUser();

  if (!isAuth) {
    return <CryptoMainNoneAuth />;
  }

  return <CryptoMain />;
}
