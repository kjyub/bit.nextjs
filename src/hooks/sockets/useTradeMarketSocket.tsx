'use client'

import useMarketPriceStore from '@/store/useMarketPriceStore'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import useVisibility from '../useVisibility'
import useToastMessageStore from '@/store/useToastMessageStore'

export default function useTradeMarketSocket() {
  const { initMarketPriceData, connectMarketPriceSocket, disconnectMarketPriceSocket } = useMarketPriceStore(
    useShallow((state) => ({
      initMarketPriceData: state.initMarketPriceData,
      marketPriceSocket: state.marketPriceSocket,
      connectMarketPriceSocket: state.connectMarketPriceSocket,
      disconnectMarketPriceSocket: state.disconnectMarketPriceSocket,
    })),
  )
  const addToastMessage = useToastMessageStore((state) => state.addMessage)

  const isVisible = useVisibility({ wait: 1000 })

  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    setIsInitialized(true)
    return () => {
      disconnectMarketPriceSocket()
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      initMarketPriceData()
      connectMarketPriceSocket()

      if (isInitialized) {
        addToastMessage('시세 데이터 연결 완료')
      }
    } else {
      disconnectMarketPriceSocket()
    }
  }, [isVisible])
}
