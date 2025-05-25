import { defaultInstance } from '@/apis/utils/api';
import { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';

class UpbitServerApi {
  // region Market
  static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result: IUpbitMarketTicker = {};

    await defaultInstance
      .get('https://api.upbit.com/v1/ticker', {
        params: {
          markets: marketCode,
        },
      })
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          result = data[0];
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  // endregion
}

export default UpbitServerApi;
