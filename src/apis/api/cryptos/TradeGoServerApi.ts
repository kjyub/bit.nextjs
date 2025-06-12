import { tradeInstance } from '@/apis/utils/tradeInstances';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';

namespace TradeGoServerApi {
  // region Market
  export async function getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result: IUpbitMarketTicker = {} as IUpbitMarketTicker;

    try {
      const response = await tradeInstance.post('markets', {
        json: {
          codes: [marketCode],
        },
      });
      console.log('getMarketCurrent response', response.url);
      const data = (await response.json()) as any;
      if (Array.isArray(data) && data.length > 0) {
        result = data[0];
      }
    } catch (error) {
      console.log('getMarketCurrent error');
      console.log(error);
    }

    return result;
  }
  // endregion
}

export default TradeGoServerApi;
