import useVisibility from "@/hooks/useVisibility"
import useMarketPriceStore from "@/store/useMarketPriceStore"
import { useEffect } from "react"
import { useShallow } from "zustand/shallow"

export default function CryptoClientLayout({ children }: { children: React.ReactNode }) {
  const { initMarketPriceData, connectMarketPriceSocket, disconnectMarketPriceSocket } = useMarketPriceStore(
    useShallow((state) => ({
      initMarketPriceData: state.initMarketPriceData,
      marketPriceSocket: state.marketPriceSocket,
      connectMarketPriceSocket: state.connectMarketPriceSocket,
      disconnectMarketPriceSocket: state.disconnectMarketPriceSocket,
    })),
  )

  const isVisible = useVisibility({ wait: 10000 })

  useEffect(() => {
    initMarketPriceData()

    return () => {
      disconnectMarketPriceSocket()
    }
  }, [])

  useEffect(() => {
    if (isVisible) {
      connectMarketPriceSocket()
    } else {
      disconnectMarketPriceSocket()
    }
  }, [isVisible])

  return children
}