// store.js
import { IUpbitMarketTicker } from '@/types/bits/BitInterfaces'
import CommonUtils from '@/utils/CommonUtils'
import { create } from 'zustand'

interface IMarketPriceStore {
    marketDic: {
        [key: string]: IUpbitMarketTicker
    }
    updateMarketPriceDic: (data: IUpbitMarketTicker) => void
}
const useMarketPriceStore = create<IMarketPriceStore>((set) => ({
    marketDic: {},
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

            let newState = { ...state }
            newState.marketDic[marketCode] = data

            // console.log(data.code, data.trade_price)

            return newState
        })
    },
}))

export default useMarketPriceStore