import { tradeDefaultInstance } from "@/apis/utils/trade-api";
import { IUpbitMarketTicker } from "@/types/cryptos/CryptoInterfaces";

class TradeGoServerApi {
  // region Market
  static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
    let result: IUpbitMarketTicker = {};

    await tradeDefaultInstance
      .post("/markets", {
        codes: [marketCode],
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

export default TradeGoServerApi;
