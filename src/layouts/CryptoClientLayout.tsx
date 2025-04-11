'use client'

import useTradeMarketSocket from "@/hooks/sockets/useTradeMarketSocket"

export default function CryptoClientLayout({ children }: { children: React.ReactNode }) {
  useTradeMarketSocket()

  return children
}