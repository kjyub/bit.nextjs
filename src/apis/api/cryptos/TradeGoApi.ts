import { tradeInstance } from '@/apis/utils/tradeInstances';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import NextUpbitApi from './NextUpbitApi';

namespace TradeGoApi {
  // region Market
  export async function getMarketsCurrent(marketCodes: Array<string> = []): Promise<Array<IUpbitMarketTicker>> {
    let result: Array<IUpbitMarketTicker> = [];

    try {
      const response = await tradeInstance.post('markets', {
        json: {
          codes: marketCodes,
        },
      });
      const data = (await response.json()) as any;
      if (Array.isArray(data)) {
        result = data;
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getMarketsCurrentDic(
    marketCodes: Array<string> = [],
  ): Promise<{ [key: string]: IUpbitMarketTicker }> {
    const markets = await NextUpbitApi.getMarketsCurrent(marketCodes);

    const result: { [key: string]: IUpbitMarketTicker } = {};
    markets.forEach((market: IUpbitMarketTicker) => {
      result[market.code] = market;
    });

    return result;
  }
  export async function getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result = {} as IUpbitMarketTicker;

    try {
      const response = await tradeInstance.post('markets', {
        json: {
          codes: [marketCode],
        },
      });
      const data = (await response.json()) as any;
      if (Array.isArray(data) && data.length > 0) {
        result = data[0];
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion

  export function getMarketSocket(): WebSocket {
    return new WebSocket(`${process.env.NEXT_PUBLIC_TRADE_SOCKET_SERVER}/ws/market`);
  }

  export function getAlarmSocket(userId?: number): WebSocket | null {
    if (!userId) {
      return null;
    }

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_USER_ALARM_SOCKET_SERVER}/ws/user?user_id=${userId}`);
    return socket;
  }
}

export default TradeGoApi;
