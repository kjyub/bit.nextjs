// store.js
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi'
import { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces'
import CommonUtils from '@/utils/CommonUtils'
import { create } from 'zustand'

const getInitData = async () => {
  return await TradeGoApi.getMarketsCurrentDic()
}

interface IMarketPriceStore {
  marketDic: {
    [key: string]: IUpbitMarketTicker
  }
  init: () => void
  updateMarketPriceDic: (data: IUpbitMarketTicker) => void
}
const useMarketPriceStore = create<IMarketPriceStore>((set) => ({
  marketDic: {},
  init: () => {
    getInitData().then((data) => {
      set({
        marketDic: data,
      })
    })
  },
  updateMarketPriceDic: (data) => {
    set((state) => {
      let marketCode: string = ''

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
          [marketCode]: data,
        },
      }
    })
  },
}))

export default useMarketPriceStore
