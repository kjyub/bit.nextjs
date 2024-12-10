import { UserTypes } from '@/types/user/UserTypes';
import ApiUtils from '@/utils/ApiUtils';
import Pagination from '@/types/api/pagination';
import { EditStateTypes } from '@/types/DataTypes';
import BitMarket from '@/types/bits/BitMarket';
import { defaultServerInstance } from '@/apis/utils/serverApis';

class BitServerApi {
    // region Market
    static async getMarkets(search: string, marketType: string): Promise<object> {
        let result: object = {}

        await defaultServerInstance.get("/api/bits/market/", { params: {
            search: search,
            market_type: marketType,
        }}).then(({ data }) => {
            result = data
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // 가격을 제외한 심플한 데이터 전부 가져온다
    static async getMarketAll(): Promise<object> {
        let result: object = {}

        await defaultServerInstance.get("/api/bits/market_all/",).then(({ data }) => {
            result = data
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getMarket(code: string): Promise<object> {
        let result: object = {}

        await defaultServerInstance.get(`/api/bits/market/${code}/`).then(({ data }) => {
            result = data
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion
}

export default BitServerApi