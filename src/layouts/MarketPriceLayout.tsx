"use client"

import { useEffect, useRef, useState } from "react"
import { v4 as uuid } from 'uuid'
import useMarketPriceStore from "@/store/useMarketPriceStore"
import TradeGoApi from "@/apis/api/bits/TradeGoApi"

export default function MarketPriceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const socketRef = useRef<WebSocket | null>(null)
    const marketPriceInit = useMarketPriceStore.getState().init

    useEffect(() => {      
        marketPriceInit()
        socketRef.current = TradeGoApi.initPriceWebSocket()

        return () => {
            socketRef.current.close()
        }
    }, [])

    return (
        <>
        </>
    )
}
