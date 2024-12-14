// store.js
import TradeGoApi from '@/apis/api/bits/TradeGoApi'
import UpbitServerApi from '@/apis/api/bits/UpbitServerApi'
import { IUpbitMarketTicker } from '@/types/bits/BitInterfaces'
import CommonUtils from '@/utils/CommonUtils'
import { create } from 'zustand'

const getInitData = async () => {
    const markets = await TradeGoApi.getMarketsCurrent()

    const data: { [key: string]: IUpbitMarketTicker } = {}
    markets.forEach((market: IUpbitMarketTicker) => {
        data[market.code] = market
    })

    return data
}

interface IMarketPriceStore {
    marketDic: {
        [key: string]: IUpbitMarketTicker
    }
    updateMarketPriceDic: (data: IUpbitMarketTicker) => void
}
const useMarketPriceStore = create<IMarketPriceStore>((set) => ({
    marketDic: {},
    init: () => {
        getInitData().then((data) => {
            set({
                marketDic: data
            })
        })
    },
    updateMarketPriceDic: (data) => {
        set((state) => {
            let marketCode: string = ""

            if (!CommonUtils.isStringNullOrEmpty(data.code)) {
                marketCode = data.code
            } else if (!CommonUtils.isStringNullOrEmpty(data.market)) {
                marketCode = data.market
            } else {
                return state
            }

            return {
                marketDic: {
                    ...state.marketDic,
                    [marketCode]: data
                }
            }
        })
    },
}))

export default useMarketPriceStore