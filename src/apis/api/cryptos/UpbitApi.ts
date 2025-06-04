import { upbitInstance } from '@/apis/utils/upbitInstances';
import type { IUpbitCandle, IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import type { CandleMinuteUnits } from '@/types/cryptos/CryptoTypes';

class UpbitApi {
  // region Market
  static async getMarketsAll(): Promise<Array<IUpbitMarket>> {
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
  static async getMarketsCurrent(marketCodes: Array<string>): Promise<Array<IUpbitMarketTicker>> {
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
  static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result: IUpbitMarketTicker = {};

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
  // to: ISO8061 포맷 (yyyy-MM-dd'T'HH:mm:ss'Z' or yyyy-MM-dd HH:mm:ss).
  static async getCandleSeconds(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };
      if (to) {
        searchParams.to = to;
      }

      const response = await upbitInstance.get('candles/seconds', { searchParams });
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getCandleMinutes(
    marketCode: string,
    count,
    unit: CandleMinuteUnits,
    to?: string,
  ): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };

      if (to) {
        searchParams.to = to;
      }

      const response = await upbitInstance.get(`candles/minutes/${unit}`, { searchParams });
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getCandleDays(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };
      if (to) {
        searchParams.to = to;
      }

      const response = await upbitInstance.get('candles/days', { searchParams });
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getCandleWeeks(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };
      if (to) {
        searchParams.to = to;
      }
      const response = await upbitInstance.get('candles/weeks', { searchParams });
      result = (await response.json()) as any;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getCandleMonths(marketCode: string, count = 200, to?: string): Promise<Array<IUpbitCandle>> {
    let result: Array<IUpbitCandle> = [];

    try {
      const searchParams: Record<string, string> = {
        market: marketCode,
        count: count.toString(),
      };
      if (to) {
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
  static async getOrderBook(marketCode: string, level = 0): Promise<IUpbitOrderBook> {
    let result: IUpbitOrderBook = {};

    try {
      const response = await upbitInstance.get('orderbook', {
        searchParams: { market: marketCode, level: level.toString() },
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
