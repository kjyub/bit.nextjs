import { tradeDefaultInstance } from '@/apis/utils/clientTradeApis'

class TradeGoApi {
  // region Market
  static async getMarketsCurrent(marketCodes: Array<string> = []): Promise<Array<IUpbitMarketTicker>> {
    let result: Array<IUpbitMarketTicker> = []

    await tradeDefaultInstance
      .post('/markets', {
        markets: marketCodes,
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
  static async getMarketsCurrentDic(marketCodes: Array<string> = []): Promise<{ [key: string]: IUpbitMarketTicker }> {
    const markets = await this.getMarketsCurrent(marketCodes)

    const result: { [key: string]: IUpbitMarketTicker } = {}
    markets.forEach((market: IUpbitMarketTicker) => {
      result[market.code] = market
    })

    return result
  }
  static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result: IUpbitMarketTicker = {}

    await tradeDefaultInstance
      .post('/markets', {
        codes: [marketCode],
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

  static getMarketSocket(): WebSocket {
    return new WebSocket(`${process.env.NEXT_PUBLIC_TRADE_SOCKET_SERVER}/market`)
  }

  static getAlarmSocket(userId?: number): WebSocket | null {
    if (!userId) {
      return null
    }

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_USER_ALARM_SOCKET_SERVER}/user?user_id=${userId}`)
    return socket
  }
}

export default TradeGoApi
