'use client'

import { CandleTimes, CandleTimeType } from '@/components/cryptos/chart/Types'
import { IUpbitCandle } from '@/types/cryptos/CryptoInterfaces'
import { useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import useVisibility from '../useVisibility'

export default function useTradeMarketChartSocket(marketCode: string, receive: (data: IUpbitCandle, timeType: CandleTimeType) => void) {
  const socketRef = useRef<WebSocket | null>(null)
  const isVisible = useVisibility({ wait: 5000 })
  const isPause = useRef<boolean>(false)

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    connectChart(marketCode, CandleTimes.SECOND)
  }, [marketCode])

  useEffect(() => {
    if (isVisible) {
      if (isPause.current) {
        if (socketRef.current) {
          socketRef.current.close()
        }
        connectChart(marketCode, CandleTimes.SECOND)
      }
    } else {
      if (socketRef.current) {
        socketRef.current.close()
        isPause.current = true
      }
    }
  }, [isVisible])

  const connectChart = async (marketCode: string, timeType: CandleTimeType) => {
    if (socketRef.current) {
      console.log('기존 연결 종료')
      socketRef.current.close()
    }

    const newSocket = new WebSocket('wss://api.upbit.com/websocket/v1')
    newSocket.binaryType = 'arraybuffer'
    newSocket.onmessage = (event: MessageEvent) => {
      try {
        const dataString = new TextDecoder('utf-8').decode(event.data as object)
        const data = JSON.parse(dataString as string)
        if (data.error) {
          console.error('WebSocket error:', data)
          return
        }
        const candleData = data as IUpbitCandle
        receive(candleData, timeType)
      } catch (error) {
        console.error('Failed to parse WebSocket message', error)
      }
    }
    socketRef.current = newSocket

    newSocket.onopen = () => {
      const ticket = String(uuid())
      const requestData = [{ ticket: ticket }, { type: `candle.1s`, codes: [marketCode] }]
      newSocket.send(JSON.stringify(requestData))
    }
  }

  return connectChart
}
