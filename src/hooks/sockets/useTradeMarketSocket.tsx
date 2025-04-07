'use client'

import TradeGoApi from '@/apis/api/cryptos/TradeGoApi'
import useMarketPriceStore from '@/store/useMarketPriceStore'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

export default function useTradeMarketSocket() {
  const { updateMarketPriceDic, initMarketPrice } = useMarketPriceStore(
    useShallow((state) => ({
      updateMarketPriceDic: state.updateMarketPriceDic,
      initMarketPrice: state.init,
    })),
  )

  useEffect(() => {
    let isMounted = true
    initMarketPrice()
    const socket = TradeGoApi.getMarketSocket()

    socket.onopen = () => {
      //
    }

    socket.onmessage = (event: MessageEvent) => {
      if (!isMounted) {
        return
      }
      try {
        const data = JSON.parse(event.data as string)
        updateMarketPriceDic(data as object)
      } catch (error) {
        console.log('Failed to parse WebSocket message', error)
      }
    }

    socket.onerror = (event) => {
      console.log('WebSocket error', event)
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      isMounted = false
      socket.close()
    }
  }, [])
}
