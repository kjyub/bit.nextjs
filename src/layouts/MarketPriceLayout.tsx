"use client"

import BitApi from "@/apis/api/bits/BitApi"
import UpbitApi from "@/apis/api/bits/UpbitApi"
import { useEffect, useRef, useState } from "react"
import { v4 as uuid } from 'uuid'
import { Socket } from "socket.io-client"

export default function MarketPriceLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {      
        socketRef.current = UpbitApi.initPriceWebSocket()

        return () => {
            socketRef.current.close()
        }
    }, [])

    return (
        <>
        </>
    )
}
