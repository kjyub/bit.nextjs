import { UserTypes } from '@/types/user/UserTypes';
import { authInstance, defaultInstance, fileInstance } from '../../utils/clientApis';
import ApiUtils from '@/utils/ApiUtils';
import Pagination from '@/types/api/pagination';
import { EditStateTypes } from '@/types/DataTypes';
import BitMarket from '@/types/bits/BitMarket';

class BitApi {
    // region Market
    static async getMarkets(search: string, marketType: string): Promise<Array<BitMarket>> {
        let result: Array<BitMarket> = []

        await defaultInstance.get("/api/bits/market/", { params: {
            search: search,
            market_type: marketType,
        }}).then(({ data }) => {
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    let market: BitMarket = new BitMarket()
                    market.parseResponse(item)
                    result.push(market)
                })
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // 가격을 제외한 심플한 데이터 전부 가져온다
    static async getMarketAll(): Promise<Array<BitMarket>> {
        let result: Array<BitMarket> = []

        await defaultInstance.get("/api/bits/market_all/",).then(({ data }) => {
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    let market: BitMarket = new BitMarket()
                    market.parseResponse(item)
                    result.push(market)
                })
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion
}

export default BitApi