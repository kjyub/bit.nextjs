'use client'

import UpbitApi from '@/apis/api/cryptos/UpbitApi'
import { IUpbitCandle } from '@/types/cryptos/CryptoInterfaces'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import CryptoMarketChartControlBar from './ControlBar'
import { CANDLE_SIZE, CandleTimeType, CandleTimes, ChartType, ChartTypes } from './Types'

const CryptoMarketFinancialChart = dynamic(() => import('./Chart'), { ssr: false })

const isAddCandle = (lastCandle?: IUpbitCandle, candle: IUpbitCandle, timeType: CandleTimeType) => {
  if (!lastCandle) {
    return true
  }

  const lastCandleTime = new Date(lastCandle.candle_date_time_kst).getTime()
  const candleTime = new Date(candle.candle_date_time_kst).getTime()

  switch (timeType) {
    case CandleTimes.SECOND:
      return lastCandleTime + 1000 < candleTime
    case CandleTimes.MINUTE1:
      return lastCandleTime + 60 * 1000 < candleTime
    case CandleTimes.MINUTE3:
      return lastCandleTime + 3 * 60 * 1000 < candleTime
    case CandleTimes.MINUTE5:
      return lastCandleTime + 5 * 60 * 1000 < candleTime
    case CandleTimes.MINUTE10:
      return lastCandleTime + 10 * 60 * 1000 < candleTime
    case CandleTimes.MINUTE15:
      return lastCandleTime + 15 * 60 * 1000 < candleTime
    case CandleTimes.DAY:
      return lastCandleTime + 24 * 60 * 60 * 1000 < candleTime
    case CandleTimes.WEEK:
      return lastCandleTime + 7 * 24 * 60 * 60 * 1000 < candleTime
    case CandleTimes.MONTH:
      return lastCandleTime + 30 * 24 * 60 * 60 * 1000 < candleTime
    default:
      return false
  }
}

interface ICryptoMarketChart {
  marketCode: string
}
export default function CryptoMarketChart({ marketCode }: ICryptoMarketChart) {
  const socketRef = useRef<WebSocket | null>(null)

  const [isCandleLoading, setCandleLoading] = useState<boolean>(false)
  const [candles, setCandles] = useState<IUpbitCandle[]>([])
  const [timeType, setTimeType] = useState<CandleTimeType>(CandleTimes.SECOND)
  const [chartType, setChartType] = useState<ChartType>(ChartTypes.AREA)

  useEffect(() => {
    initChart(CandleTimes.SECOND)
  }, [marketCode])

  const initChart = useCallback(
    async (timeType: CandleTimeType) => {
      await getCandleData(timeType)
      connectChart(marketCode, timeType)
    },
    [marketCode],
  )

  const connectChart = useCallback(async (marketCode: string, timeType: CandleTimeType) => {
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
        addCandle(candleData, timeType)
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
  }, [])

  const getBeforeCandleData = useCallback(async () => {
    if (isCandleLoading) {
      return
    }
    if (candles.length === 0) {
      return
    }

    setCandleLoading(true)

    const last = candles[candles.length - 1]
    const to = last.candle_date_time_kst + '+09:00'

    let newData = []

    switch (timeType) {
      case CandleTimes.SECOND:
        newData = await UpbitApi.getCandleSeconds(marketCode, CANDLE_SIZE, to)
        break
      case CandleTimes.MINUTE1:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 1, to)
        break
      case CandleTimes.MINUTE3:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 3, to)
        break
      case CandleTimes.MINUTE5:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 5, to)
        break
      case CandleTimes.MINUTE10:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 10, to)
        break
      case CandleTimes.MINUTE15:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 15, to)
        break
      case CandleTimes.DAY:
        newData = await UpbitApi.getCandleDays(marketCode, CANDLE_SIZE, to)
        break
      case CandleTimes.WEEK:
        newData = await UpbitApi.getCandleWeeks(marketCode, CANDLE_SIZE, to)
        break
      case CandleTimes.MONTH:
        newData = await UpbitApi.getCandleMonths(marketCode, CANDLE_SIZE, to)
        break
      default:
        break
    }

    const newCandles = [...candles, ...newData]
    setCandles(newCandles)
    setCandleLoading(false)

    return newCandles
  }, [isCandleLoading, candles, marketCode, timeType])

  const getCandleData = useCallback(
    async (timeType: CandleTimeType) => {
      if (isCandleLoading) {
        return
      }
      setCandleLoading(true)

      let data: IUpbitCandle[] = []
      let chartType: ChartType = ChartTypes.CANDLE

      switch (timeType) {
        case CandleTimes.SECOND:
          data = await UpbitApi.getCandleSeconds(marketCode, CANDLE_SIZE)
          chartType = ChartTypes.AREA
          break
        case CandleTimes.MINUTE1:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 1)
          break
        case CandleTimes.MINUTE3:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 3)
          break
        case CandleTimes.MINUTE5:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 5)
          break
        case CandleTimes.MINUTE10:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 10)
          break
        case CandleTimes.MINUTE15:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 15)
          break
        case CandleTimes.DAY:
          data = await UpbitApi.getCandleDays(marketCode, CANDLE_SIZE)
          break
        case CandleTimes.WEEK:
          data = await UpbitApi.getCandleWeeks(marketCode, CANDLE_SIZE)
          break
        case CandleTimes.MONTH:
          data = await UpbitApi.getCandleMonths(marketCode, CANDLE_SIZE)
          break
        default:
          break
      }

      setCandles(data)
      setTimeType(timeType)
      setChartType(chartType)
      setCandleLoading(false)
    },
    [isCandleLoading, marketCode],
  )

  const addCandle = useCallback((candle: IUpbitCandle, timeType: CandleTimeType) => {
    setCandles((candles) => {
      // 마지막 캔들이 같은 시간인지 확인
      const isAdd = isAddCandle(candles[0], candle, timeType)
      if (isAdd) {
        return [candle, ...candles]
      }
      if (candles.length === 0) {
        return []
      }

      // 마지막 캔들이 같은 시간이라면, 마지막 캔들을 업데이트
      const newCandles = [...candles]
      newCandles[0] = candle
      return newCandles
    })
  }, [])

  return (
    <div className="flex flex-col w-full h-full">
      <CryptoMarketChartControlBar
        timeType={timeType}
        chartType={chartType}
        setChartType={setChartType}
        initChart={initChart}
      />
      <div className="relative w-full h-full">
        <CryptoMarketFinancialChart
          timeType={timeType}
          chartType={chartType}
          candles={candles}
          getBeforeData={getBeforeCandleData}
        />
      </div>
    </div>
  )
}
