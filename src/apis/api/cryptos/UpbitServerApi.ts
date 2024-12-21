import { UserTypes } from '@/types/users/UserTypes';
import ApiUtils from '@/utils/ApiUtils';
import Pagination from '@/types/api/pagination';
import { EditStateTypes } from '@/types/DataTypes';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import { io, Socket } from "socket.io-client"
import { defaultServerInstance } from '@/apis/utils/serverApis';
import { IUpbitMarket, IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';

class UpbitServerApi {
    // region Market
    static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
        let result: IUpbitMarketTicker = {}

        await defaultServerInstance.get("https://api.upbit.com/v1/ticker", { params: {
            markets: marketCode
        }}).then(({ data }) => {
            if (Array.isArray(data) && data.length > 0) {
                result = data[0]
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion
}

export default UpbitServerApi