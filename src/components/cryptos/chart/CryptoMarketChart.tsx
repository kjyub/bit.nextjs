"use client"

import UpbitApi from "@/apis/api/cryptos/UpbitApi"
import { IUpbitCandle } from "@/types/cryptos/CryptoInterfaces"
import { CandleMinuteUnits } from "@/types/cryptos/CryptoTypes"
import { useCallback, useEffect, useRef, useState } from "react"
import { CANDLE_SIZE, CandleTimes, CandleTimeType, ChartType, ChartTypes } from "./Types"
import CryptoMarketChartControlBar from "./ControlBar"
import dynamic from "next/dynamic"
import { v4 as uuid } from "uuid"
import { debounce } from "lodash"

const CryptoMarketFinancialChart = dynamic(() => import("./Chart"), { ssr: false })

interface ICryptoMarketChart {
    marketCode: string
}
export default function CryptoMarketChart({ marketCode }: ICryptoMarketChart) {
    const socketRef = useRef<WebSocket | null>(null)
    const [ticket, setTicket] = useState<string>(String(uuid()))

    const [isCandleLoading, setCandleLoading] = useState<boolean>(false)
    const [candles, setCandles] = useState<IUpbitCandle[]>([])
    const [timeType, setTimeType] = useState<CandleTimeType>(CandleTimes.SECOND)
    const [chartType, setChartType] = useState<ChartType>(ChartTypes.AREA)

    useEffect(() => {
        connectChart()
    }, [marketCode, timeType])

    const connectChart = useCallback(() => {
        if (socketRef.current) {
            console.log("기존 연결 종료")
            socketRef.current.close()
        }

        setCandles([])

        const newSocket = new WebSocket('wss://api.upbit.com/websocket/v1')
        newSocket.binaryType = "arraybuffer"
        newSocket.onmessage = (event: MessageEvent) => {
            try {
                const dataString = new TextDecoder("utf-8").decode(event.data as object);
                const data = JSON.parse(dataString as string)
                addCandles(data as IUpbitCandle)
            } catch (error) {
                console.error('Failed to parse WebSocket message', error)
            }
        }
        socketRef.current = newSocket

        newSocket.onopen = () => {
            const requestData = [
                {ticket: ticket},
                {type: `candle.${timeType}`, codes: [marketCode]},
            ]
            newSocket.send(JSON.stringify(requestData))
        }
    }, [marketCode, ticket, timeType, candles])
    
    const addCandles = useCallback((data: IUpbitCandle) => {
        setCandles((prev) => [data, ...prev])
    }, [setCandles])

    const getBeforeData = useCallback(async () => {
        if (isCandleLoading) {
            return
        }
        if (candles.length === 0) {
            return
        }

        setCandleLoading(true)

        const last = candles[candles.length - 1]
        const to = last.candle_date_time_kst + "+09:00"
        
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

        setCandles((prev) => [...prev, ...newData])
        setCandleLoading(false)

        return [...candles, ...newData]
    }, [isCandleLoading, candles, marketCode, timeType])

    return (
        <div className="flex flex-col w-full h-full">
            <CryptoMarketChartControlBar
                marketCode={marketCode}
                timeType={timeType}
                setTimeType={setTimeType}
                setCandles={setCandles}
                chartType={chartType}
                setChartType={setChartType}
            />
            <div className="relative w-full h-full">
                <CryptoMarketFinancialChart timeType={timeType} chartType={chartType} candles={candles} getBeforeData={getBeforeData} />
            </div>
        </div>
    )
}

const getCandlesBefore = (setCandles: React.Dispatch<React.SetStateAction<IUpbitCandle[]>>, timeType: CandleTimeType, marketCode: string, to: string) => {
    
}