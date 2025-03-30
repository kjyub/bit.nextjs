import useMarketPriceStore from '@/store/useMarketPriceStore'
import { IUpbitCandle } from '@/types/cryptos/CryptoInterfaces'
import { CandleMinuteUnits } from '@/types/cryptos/CryptoTypes'
import { defaultInstance } from '../../utils/clientApis'

class UpbitApi {
  // region Market
  static async getMarketsAll(): Promise<Array<IUpbitMarket>> {
    let result: Array<IUpbitMarket> = []

    await defaultInstance
      .get('https://api.upbit.com/v1/market/all')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          result = data
        }
      })
      .catch((error) => {
        console.log(error)
      })

    return result
  }
  static async getMarketsCurrent(marketCodes: Array<string>): Promise<Array<IUpbitMarketTicker>> {
    let result: Array<IUpbitMarketTicker> = []

    await defaultInstance
      .get('https://api.upbit.com/v1/ticker', {
        params: {
          markets: marketCodes.join(','),
        },
      })
      .then(({ data }) => {
        if (Array.isArray(data)) {
          result = data
        }
      })
      .catch((error) => {
        console.log(error)
      })

    return result
  }
  static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result: IUpbitMarketTicker = {}

    await defaultInstance
      .get('https://api.upbit.com/v1/ticker', {
        params: {
          markets: marketCode,
        },
      })
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          result = data[0]
        }
      })
      .catch((error) => {
        console.log(error)
      })

    return result
  }
  // endregion

  static initPriceWebSocket(sendMessage: string | null): WebSocket {
    // const socket = new WebSocket('wss://api.upbit.com/websocket/v1')
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_TRADE_SOCKET_SERVER}/ws`)
    socket.binaryType = 'arraybuffer'
    const updateMarketPriceDic = useMarketPriceStore.getState().updateMarketPriceDic

    socket.onopen = () => {
      console.log('WebSocket connected')

      if (sendMessage) {
        socket.send(sendMessage)
        console.log(sendMessage)
      }
    }

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string)
        updateMarketPriceDic(data as object)
      } catch (error) {
        console.error('Failed to parse WebSocket message', error)
      }
    }

    socket.onerror = (event) => {
      console.error('WebSocket error', event)
    }

    socket.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return socket
  }

  // region Candle
  // to: ISO8061 포맷 (yyyy-MM-dd'T'HH:mm:ss'Z' or yyyy-MM-dd HH:mm:ss).
  static getCandleSeconds(marketCode: string, count: number = 200, to: string): Promise<Array<IUpbitCandle>> {
    return defaultInstance
      .get('https://api.upbit.com/v1/candles/seconds', {
        params: {
          market: marketCode,
          to: to,
          count: count,
        },
      })
      .then(({ data }) => {
        return data
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  }
  static getCandleMinutes(
    marketCode: string,
    count: number = 200,
    unit: CandleMinuteUnits,
    to: string,
  ): Promise<Array<IUpbitCandle>> {
    return defaultInstance
      .get(`https://api.upbit.com/v1/candles/minutes/${unit}`, {
        params: {
          market: marketCode,
          to: to,
          count: count,
        },
      })
      .then(({ data }) => {
        return data
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  }
  static getCandleDays(marketCode: string, count: number = 200, to: string): Promise<Array<IUpbitCandle>> {
    return defaultInstance
      .get('https://api.upbit.com/v1/candles/days', {
        params: {
          market: marketCode,
          to: to,
          count: count,
        },
      })
      .then(({ data }) => {
        return data
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  }
  static getCandleWeeks(marketCode: string, count: number = 200, to: string): Promise<Array<IUpbitCandle>> {
    return defaultInstance
      .get('https://api.upbit.com/v1/candles/weeks', {
        params: {
          market: marketCode,
          to: to,
          count: count,
        },
      })
      .then(({ data }) => {
        return data
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  }
  static getCandleMonths(marketCode: string, count: number = 200, to: string): Promise<Array<IUpbitCandle>> {
    return defaultInstance
      .get('https://api.upbit.com/v1/candles/months', {
        params: {
          market: marketCode,
          to: to,
          count: count,
        },
      })
      .then(({ data }) => {
        return data
      })
      .catch((error) => {
        console.log(error)
        return []
      })
  }
  // endregion
}

export default UpbitApi
