import { UserTypes } from '@/types/users/UserTypes';
import { authInstance, defaultInstance, fileInstance } from '../../utils/clientApis';
import ApiUtils from '@/utils/ApiUtils';
import Pagination from '@/types/api/pagination';
import { EditStateTypes } from '@/types/DataTypes';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import MarketCommunity from '@/types/cryptos/MarketCommunity';
import MarketCommunityComment from '@/types/cryptos/MarketCommunityComment';
import { LikeTypes } from '@/types/common/CommonTypes';
import CryptoWallet from '@/types/cryptos/CryptoWallet';
import TradePosition from '@/types/cryptos/TradePosition';
import TradeOrder from '@/types/cryptos/TradeOrder';
import TradeHistory from '@/types/cryptos/TradeHistory';
import CommonUtils from '@/utils/CommonUtils';
import { IMyTradeData } from '@/types/cryptos/CryptoInterfaces';

class CryptoApi {
    // region MyTrades
    static async getMyTrades(): Promise<IMyTradeData> {
        const result: IMyTradeData = {
            wallet: new CryptoWallet(),
            positions: [],
            orders: [],
        }

        await authInstance.post("/api/cryptos/my_trades/").then(({ data }) => {
            try {
                result.wallet.parseResponse(data.wallet as object)
                if (data.positions && Array.isArray(data.positions)) {
                    data.positions.forEach((item) => {
                        const tradePosition: TradePosition = new TradePosition()
                        tradePosition.parseResponse(item as object)
                        result.positions.push(tradePosition)
                    })
                }
                if (data.orders && Array.isArray(data.orders)) {
                    data.orders.forEach((item) => {
                        const tradeOrder: TradeOrder = new TradeOrder()
                        tradeOrder.parseResponse(item as object)
                        result.orders.push(tradeOrder)
                    })
                }
            } catch {
                //
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion
    // region Wallet
    static async getWallet(): Promise<CryptoWallet> {
        const result: CryptoWallet = new CryptoWallet()

        await authInstance.get("/api/cryptos/wallet/").then(({ data }) => {
            result.parseResponse(data as object)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async transactionWallet(requestData: object): Promise<boolean> {
        let result = false

        await authInstance.post("/api/cryptos/wallet_transaction/", requestData).then(({ data }) => {
            result = true
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion
    // region Market
    static async getMarkets(search: string, marketType: string): Promise<Array<CryptoMarket>> {
        const result: Array<CryptoMarket> = []

        await defaultInstance.get("/api/cryptos/market/", { params: {
            search: search,
            market_type: marketType,
        }}).then(({ data }) => {
            if (Array.isArray(data as object)) {
                data.forEach((item) => {
                    const market: CryptoMarket = new CryptoMarket()
                    market.parseResponse(item as object)
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
            if (Array.isArray(data as object)) {
                data.forEach((item) => {
                    const market: CryptoMarket = new CryptoMarket()
                    market.parseResponse(item as object)
                    result.push(market)
                })
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion

    // region Order
    static async orderMarket(requestData: object): Promise<boolean> {
        let result = false

        await authInstance.post("/api/cryptos/order_market/", requestData).then(({ data }) => {
            result = data
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async orderLimit(requestData: object): Promise<boolean> {
        let result = false

        await authInstance.post("/api/cryptos/order_limit/", requestData).then(({ data }) => {
            result = data
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async orderLimitCancel(orderId: number): Promise<boolean> {
        let result = false

        await authInstance.post("/api/cryptos/order_limit_cancel/", { order_id: orderId }).then(({ data }) => {
            result = data
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async orderLimitChase(orderId: number, price: number): Promise<boolean> {
        let result = false

        await authInstance.post("/api/cryptos/order_limit_chase/", { order_id: orderId, price }).then(({ data }) => {
            result = data
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion

    // region Trade
    static async getTradePostions(): Promise<Array<TradePosition>> {
        const result: Array<TradePosition> = []

        await authInstance.get("/api/cryptos/my_position/").then(({ data }) => {
            if (Array.isArray(data as object)) {
                data.forEach((item) => {
                    const tradePosition: TradePosition = new TradePosition()
                    tradePosition.parseResponse(item as object)
                    result.push(tradePosition)
                })
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getTradeOrders(): Promise<Array<TradeOrder>> {
        const result: Array<TradeOrder> = []

        await authInstance.get("/api/cryptos/my_order/").then(({ data }) => {
            if (Array.isArray(data as object)) {
                data.forEach((item) => {
                    const tradeOrder: TradeOrder = new TradeOrder()
                    tradeOrder.parseResponse(item as object)
                    result.push(tradeOrder)
                })
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion

    // region History
    static async getTradeOrderHistories(pageIndex: number = 1, pageSize: number = 50, dateStart: string = "", dateEnd: string = ""): Promise<Pagination<TradeOrder>> {
        const result = new Pagination<TradeOrder>()

        const params = {
            page: pageIndex,
            page_size: pageSize,
        }

        if (!CommonUtils.isStringNullOrEmpty(dateStart)) {
            params["date_start"] = dateStart
        }
        if (!CommonUtils.isStringNullOrEmpty(dateEnd)) {
            params["date_end"] = dateEnd
        }

        await authInstance.get("/api/cryptos/my_order_history/", { params }).then(({ data }) => {
            result.parseResponse(data as object, TradeOrder)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getTradeHistories(pageIndex: number = 1, pageSize: number = 50, dateStart: string = "", dateEnd: string = ""): Promise<Pagination<TradeHistory>> {
        const result = new Pagination<TradeHistory>()

        const params = {
            page: pageIndex,
            page_size: pageSize,
        }

        if (!CommonUtils.isStringNullOrEmpty(dateStart)) {
            params["date_start"] = dateStart
        }
        if (!CommonUtils.isStringNullOrEmpty(dateEnd)) {
            params["date_end"] = dateEnd
        }

        await authInstance.get("/api/cryptos/my_trade_history/", { params }).then(({ data }) => {
            result.parseResponse(data as object, TradeHistory)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getTradePositionHistories(pageIndex: number = 1, pageSize: number = 50, dateStart: string = "", dateEnd: string = ""): Promise<Pagination<TradePosition>> {
        const result = new Pagination<TradePosition>()

        const params = {
            page: pageIndex,
            page_size: pageSize,
        }

        if (!CommonUtils.isStringNullOrEmpty(dateStart)) {
            params["date_start"] = dateStart
        }
        if (!CommonUtils.isStringNullOrEmpty(dateEnd)) {
            params["date_end"] = dateEnd
        }

        await authInstance.get("/api/cryptos/my_position_history/", { params }).then(({ data }) => {
            result.parseResponse(data as object, TradePosition)
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
            result.parseResponse(data as object, MarketCommunity)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getCommunityDetail(nanoId: string): Promise<MarketCommunity> {
        const result: MarketCommunity = new MarketCommunity()

        await authInstance.get(`/api/cryptos/community/${nanoId}/`).then(({ data }) => {
            result.parseResponse(data as object)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async createCommunity(requestData: object): Promise<MarketCommunity> {
        const result: MarketCommunity = new MarketCommunity()

        await authInstance.post("/api/cryptos/community_create/", requestData).then(({ data }) => {
            result.parseResponse(data as object)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async updateCommunity(nanoId: string, requestData: object): Promise<MarketCommunity> {
        const result: MarketCommunity = new MarketCommunity()

        await authInstance.put(`/api/cryptos/community_update/${nanoId}/`, requestData).then(({ data }) => {
            result.parseResponse(data as object)
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
    static async likeCommunity(nanoId: string, likeType: LikeTypeValues): Promise<boolean> {
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
            result.parseResponse(data as object, MarketCommunityComment)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async createCommunityComment(requestData: object): Promise<MarketCommunityComment> {
        const result: MarketCommunityComment = new MarketCommunityComment()

        await authInstance.post("/api/cryptos/community_comment_create/", requestData).then(({ data }) => {
            result.parseResponse(data as object)
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async updateCommunityComment(id: number, requestData: object): Promise<MarketCommunityComment> {
        const result: MarketCommunityComment = new MarketCommunityComment()

        await authInstance.put(`/api/cryptos/community_comment_update/${id}/`, requestData).then(({ data }) => {
            result.parseResponse(data as object)
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