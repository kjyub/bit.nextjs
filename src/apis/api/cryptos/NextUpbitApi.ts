import { upbitInstance } from '@/apis/utils/upbitInstances';
import type { IUpbitCandle, IUpbitMarket, IUpbitMarketTicker, IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import type { CandleMinuteUnits } from '@/types/cryptos/CryptoTypes';

namespace NextUpbitApi {
  // region Market
  export async function getMarketsCurrent(marketCodes: Array<string>): Promise<Array<IUpbitMarketTicker>> {
    let result: Array<IUpbitMarketTicker> = [];

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/upbit/markets`);
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ markets: marketCodes }),
      });
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    const result = await NextUpbitApi.getMarketsCurrent([marketCode]);
    return result[0];
  }
  // endregion

  // region Candle
  function isBeforeServiceStart(to: string): boolean {
    // 업비트 서비스 시작일인 2017년 10월 이전을 조회할려는지 확인
    const date = new Date(to);
    const startDate = new Date('2017-10-01');
    return date < startDate;
  }

  // to: ISO8061 포맷 (yyyy-MM-dd'T'HH:mm:ss'Z' or yyyy-MM-dd HH:mm:ss).
  export async function getCandleSeconds(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/upbit/candles/seconds`);
      url.searchParams.set('market', marketCode);
      url.searchParams.set('count', count.toString());
      if (to && !isBeforeServiceStart(to)) {
        url.searchParams.set('to', to);
      }

      const response = await fetch(url);
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getCandleMinutes(
    marketCode: string,
    count: number,
    unit: CandleMinuteUnits,
    to?: string,
  ): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/upbit/candles/minutes/${unit}`);
      url.searchParams.set('market', marketCode);
      url.searchParams.set('count', count.toString());
      if (to && !isBeforeServiceStart(to)) {
        url.searchParams.set('to', to);
      }

      const response = await fetch(url);
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getCandleDays(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/upbit/candles/days`);
      url.searchParams.set('market', marketCode);
      url.searchParams.set('count', count.toString());
      if (to && !isBeforeServiceStart(to)) {
        url.searchParams.set('to', to);
      }

      const response = await fetch(url);
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getCandleWeeks(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/upbit/candles/weeks`);
      url.searchParams.set('market', marketCode);
      url.searchParams.set('count', count.toString());
      if (to && !isBeforeServiceStart(to)) {
        url.searchParams.set('to', to);
      }

      const response = await fetch(url);
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getCandleMonths(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/upbit/candles/months`);
      url.searchParams.set('market', marketCode);
      url.searchParams.set('count', count.toString());
      if (to && !isBeforeServiceStart(to)) {
        url.searchParams.set('to', to);
      }

      const response = await fetch(url);
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion

  // region OrderBook
  export async function getOrderBook(marketCode: string, level = 0): Promise<IUpbitOrderBook> {
    let result = {} as IUpbitOrderBook;

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/upbit/orderbook`);
      url.searchParams.set('market', marketCode);
      url.searchParams.set('level', level.toString());

      const response = await fetch(url);
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
}

export default NextUpbitApi;
