import { upbitInstance } from '@/apis/utils/upbitInstances';
import type { IUpbitCandle, IUpbitMarket, IUpbitMarketTicker, IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import type { CandleMinuteUnits } from '@/types/cryptos/CryptoTypes';

// [nextjs api -> upbit]
namespace UpbitApi {
  // region Market
  export async function getMarketsAll(): Promise<Array<IUpbitMarket>> {
    let result: Array<IUpbitMarket> = [];

    try {
      const response = await upbitInstance.get('market/all');
      const data = (await response.json()) as any;
      if (Array.isArray(data)) {
        result = data;
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getMarketsCurrent(marketCodes: Array<string>): Promise<Array<IUpbitMarketTicker>> {
    let result: Array<IUpbitMarketTicker> = [];

    try {
      const response = await upbitInstance.get('ticker', {
        searchParams: {
          markets: marketCodes.join(','),
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
  export async function getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result = {} as IUpbitMarketTicker;

    try {
      const response = await upbitInstance.get('ticker', {
        searchParams: {
          markets: marketCode,
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
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };
      if (to && !isBeforeServiceStart(to)) {
        searchParams.to = to;
      }

      const response = await upbitInstance.get('candles/seconds', { searchParams });
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
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };

      if (to && !isBeforeServiceStart(to)) {
        searchParams.to = to;
      }

      const response = await upbitInstance.get(`candles/minutes/${unit}`, { searchParams });
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getCandleDays(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };
      if (to && !isBeforeServiceStart(to)) {
        searchParams.to = to;
      }

      const response = await upbitInstance.get('candles/days', { searchParams });
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getCandleWeeks(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };
      if (to && !isBeforeServiceStart(to)) {
        searchParams.to = to;
      }
      const response = await upbitInstance.get('candles/weeks', { searchParams });
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getCandleMonths(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };
      if (to && !isBeforeServiceStart(to)) {
        searchParams.to = to;
      }

      const response = await upbitInstance.get('candles/months', { searchParams });
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
      const response = await upbitInstance.get('orderbook', {
        searchParams: { markets: marketCode, level: level.toString() },
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
}

export default UpbitApi;
