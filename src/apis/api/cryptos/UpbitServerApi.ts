import { upbitInstance } from '@/apis/utils/upbitInstances';
import { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import ky from 'ky';

class UpbitServerApi {
  // region Market
  static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result: IUpbitMarketTicker = {};

    try {
      const response = await upbitInstance.get('https://api.upbit.com/v1/ticker', {
        searchParams: {
          markets: marketCode,
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

export default UpbitServerApi;
