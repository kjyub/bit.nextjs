import { upbitInstance } from '@/apis/utils/upbitInstances';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';

namespace UpbitServerApi {
  // region Market
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
}

export default UpbitServerApi;
