'use client'

import CryptoMarketList from '@/components/cryptos/CryptoMarketList'
import CryptoNavigation from '@/components/cryptos/CryptoNavigation'
import CryptoFallback from '@/components/fallbacks/CryptoFallback'
import useTradeMarketSocket from '@/hooks/useTradeMarketSocket'
import * as S from '@/styles/CryptoMarketStyles'
import * as MS from '@/styles/MainStyles'
import { Suspense } from 'react'

export default function CryptoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  useTradeMarketSocket()

  return (
    <MS.PageLayout>
      <div className="flex w-full h-10 bg-red-500"></div>
      <S.Layout>
        <Suspense fallback={<CryptoFallback />}>{children}</Suspense>

        <S.MarketListLayout>
          <div className="py-2 border-b border-slate-600/50">
            <CryptoNavigation />
          </div>

          <CryptoMarketList />
        </S.MarketListLayout>
      </S.Layout>
    </MS.PageLayout>
  )
}
