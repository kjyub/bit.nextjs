"use client"

import { useEffect, useRef, useState } from "react"
import { v4 as uuid } from 'uuid'
import useMarketPriceStore from "@/store/useMarketPriceStore"
import TradeGoApi from "@/apis/api/cryptos/TradeGoApi"
import { useUser } from "@/hooks/useUser"
import CommonUtils from "@/utils/CommonUtils"
import useUserInfoStore from "@/store/useUserInfo"

export default function MarketPriceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, isUserLoading] = useUser()
    const marketSocketRef = useRef<WebSocket | null>(null)
    const marketPriceInit = useMarketPriceStore.getState().init

    useEffect(() => {      
        marketPriceInit()

        marketSocketRef.current = TradeGoApi.initPriceWebSocket()

        return () => {
            marketSocketRef.current.close()
        }
    }, [user.uuid])

    return (
        <>
        </>
    )
}
