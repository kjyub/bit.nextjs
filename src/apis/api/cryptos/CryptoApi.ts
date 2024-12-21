import { UserTypes } from '@/types/users/UserTypes';
import { authInstance, defaultInstance, fileInstance } from '../../utils/clientApis';
import ApiUtils from '@/utils/ApiUtils';
import Pagination from '@/types/api/pagination';
import { EditStateTypes } from '@/types/DataTypes';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import MarketCommunity from '@/types/cryptos/MarketCommunity';
import MarketCommunityComment from '@/types/cryptos/MarketCommunityComment';
import { LikeTypes } from '@/types/common/CommonTypes';

class CryptoApi {
    // region Market
    static async getMarkets(search: string, marketType: string): Promise<Array<CryptoMarket>> {
        const result: Array<CryptoMarket> = []

        await defaultInstance.get("/api/cryptos/market/", { params: {
            search: search,
            market_type: marketType,
        }}).then(({ data }) => {
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    const market: CryptoMarket = new CryptoMarket()
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
    static async getMarketAll(): Promise<Array<CryptoMarket>> {
        const result: Array<CryptoMarket> = []

        await defaultInstance.get("/api/cryptos/market_all/",).then(({ data }) => {
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    const market: CryptoMarket = new CryptoMarket()
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

    // region Community
    static async getCommunityList(search: string, marketCode: string, page: number, pageSize: number): Promise<Pagination<MarketCommunity>> {
        const result: Pagination<MarketCommunity> = new Pagination<MarketCommunity>()

        await defaultInstance.get("/api/cryptos/community/", { params: {
            search: search,
            market_code: marketCode,
            page: page,
            page_size: pageSize,
        }}).then(({ data }) => {
            result.parseResponse(data, MarketCommunity)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getCommunityDetail(nanoId: string): Promise<MarketCommunity> {
        const result: MarketCommunity = new MarketCommunity()

        await authInstance.get(`/api/cryptos/community/${nanoId}/`).then(({ data }) => {
            result.parseResponse(data)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async createCommunity(requestData: object): Promise<MarketCommunity> {
        const result: MarketCommunity = new MarketCommunity()

        await authInstance.post("/api/cryptos/community_create/", requestData).then(({ data }) => {
            result.parseResponse(data)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async updateCommunity(nanoId: string, requestData: object): Promise<MarketCommunity> {
        const result: MarketCommunity = new MarketCommunity()

        await authInstance.put(`/api/cryptos/community_update/${nanoId}/`, requestData).then(({ data }) => {
            result.parseResponse(data)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async deleteCommunity(nanoId: string): Promise<boolean> {
        let result = false

        await authInstance.delete(`/api/cryptos/community_update/${nanoId}/`).then(() => {
            result = true
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async likeCommunity(nanoId: string, likeType: LikeTypes): Promise<boolean> {
        let result = false

        await authInstance.post(`/api/cryptos/community_like/${nanoId}/`, { like_type: likeType }).then(() => {
            result = true
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion
    // region Community Comment
    static async getCommunityCommentList(communityNanoId: string, pageIndex: number, pageSize: number): Promise<Pagination<MarketCommunityComment>> {
        const result: Pagination<MarketCommunityComment> = new Pagination<MarketCommunityComment>()

        await defaultInstance.get(`/api/cryptos/community_comment/`, { params: {
            community_id: communityNanoId,
            page: pageIndex,
            page_size: pageSize,
        }}).then(({ data }) => {
            result.parseResponse(data, MarketCommunityComment)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async createCommunityComment(requestData: object): Promise<MarketCommunityComment> {
        const result: MarketCommunityComment = new MarketCommunityComment()

        await authInstance.post("/api/cryptos/community_comment_create/", requestData).then(({ data }) => {
            result.parseResponse(data)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async updateCommunityComment(id: number, requestData: object): Promise<MarketCommunityComment> {
        const result: MarketCommunityComment = new MarketCommunityComment()

        await authInstance.put(`/api/cryptos/community_comment_update/${id}/`, requestData).then(({ data }) => {
            result.parseResponse(data)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async deleteCommunityComment(id: number): Promise<boolean> {
        let result = false

        await authInstance.delete(`/api/cryptos/community_comment_update/${id}/`).then(() => {
            result = true
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion
}

export default CryptoApi