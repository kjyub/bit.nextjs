import { tradeInstance } from '@/apis/utils/tradeInstances';
import { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';

class TradeGoServerApi {
  // region Market
  static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result: IUpbitMarketTicker = {};

    try {
      const response = await tradeInstance.post('markets', {
        json: {
          codes: [marketCode],
        },
      });
      const data = await response.json();
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

export default TradeGoServerApi;
