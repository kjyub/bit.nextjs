"use client"

import UpbitApi from "@/apis/api/cryptos/UpbitApi"
import { IUpbitCandle } from "@/types/cryptos/CryptoInterfaces"
import { CandleMinuteUnits } from "@/types/cryptos/CryptoTypes"
import { useEffect, useState } from "react"

const CANDLE_SIZE = 200

const CandleTimes = {
    SECOND: "SECOND",
    MINUTE: "MINUTE",
    DAY: "DAY",
    WEEK: "WEEK",
    MONTH: "MONTH",
} as const
type CandleTimeType = typeof CandleTimes[keyof typeof CandleTimes]

interface ICryptoMarketChart {
    marketCode: string
}
export default function CryptoMarketChart({ marketCode }: ICryptoMarketChart) {
    const [candles, setCandles] = useState<IUpbitCandle[]>([])
    const [timeType, setTimeType] = useState<CandleTimeType>(CandleTimes.SECOND)

    useEffect(() => {
    }, [])

    const getSeconds = async () => {
        const candles = await UpbitApi.getCandleSeconds(marketCode, CANDLE_SIZE)
        setCandles(candles)
        setTimeType(CandleTimes.SECOND)
    }

    const getMinutes = async (_minute: CandleMinuteUnits) => {
        const candles = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, _minute)
        setCandles(candles)
        setTimeType(CandleTimes.MINUTE)
    }

    const getDays = async () => {
        const candles = await UpbitApi.getCandleDays(marketCode, CANDLE_SIZE)
        setCandles(candles)
        setTimeType(CandleTimes.DAY)
    }

    const getWeeks = async () => {
        const candles = await UpbitApi.getCandleWeeks(marketCode, CANDLE_SIZE)
        setCandles(candles)
        setTimeType(CandleTimes.WEEK)
    }

    const getMonths = async () => {
        const candles = await UpbitApi.getCandleMonths(marketCode, CANDLE_SIZE)
        setCandles(candles)
        setTimeType(CandleTimes.MONTH)
    }

    return (
        <div>
            CryptoMarketChart
        </div>
    )
}