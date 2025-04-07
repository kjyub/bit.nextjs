// store.js
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi'
import { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces'
import { create } from 'zustand'

const getInitData = async () => {
  return await TradeGoApi.getMarketsCurrentDic()
}

interface IMarketPriceStore {
  marketDic: {
    [key: string]: IUpbitMarketTicker
  }
  init: () => Promise<void>
  updateMarketPriceDic: (data: IUpbitMarketTicker) => void
}
const useMarketPriceStore = create<IMarketPriceStore>((set, get) => ({
  marketDic: {},
  init: async () => {
    const data = await getInitData()

    set({ marketDic: data })
  },
  updateMarketPriceDic: (data) => {
    let marketCode: string = ''

    if (data.code) {
      marketCode = data.code
    } else if (data.market) {
      marketCode = data.market
    }

    if (!marketCode) {
      return
    }

    const marketDic = get().marketDic
    set({
      marketDic: {
        ...marketDic,
        [marketCode]: data,
      },
    })
  },
}))

export default useMarketPriceStore
