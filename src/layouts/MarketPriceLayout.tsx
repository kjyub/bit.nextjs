'use client'

import TradeGoApi from '@/apis/api/cryptos/TradeGoApi'
import { useUser } from '@/hooks/useUser'
import useMarketPriceStore from '@/store/useMarketPriceStore'
import { useEffect, useRef } from 'react'

export default function MarketPriceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, _isUserLoading] = useUser()
  const marketSocketRef = useRef<WebSocket | null>(null)
  const marketPriceInit = useMarketPriceStore.getState().init

  useEffect(() => {
    marketPriceInit()

    marketSocketRef.current = TradeGoApi.initPriceWebSocket()

    return () => {
      marketSocketRef.current.close()
    }
  }, [user.uuid])

  return <>{children}</>
}
