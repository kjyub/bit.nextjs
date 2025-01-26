// store.js
import CryptoApi from '@/apis/api/cryptos/CryptoApi'
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi'
import UpbitServerApi from '@/apis/api/cryptos/UpbitServerApi'
import UserApi from '@/apis/api/users/UserApi'
import { IMyTradeData, IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces'
import CommonUtils from '@/utils/CommonUtils'
import { create } from 'zustand'

const getInitData = async () => {
    const wallet = await CryptoApi.getWallet()
    const user = await UserApi.getUserCurrent()

    const myTrades = await CryptoApi.getMyTrades()

    return { 
        cash: user.cash,
        balance: wallet.balance,
        myTrades: myTrades,
    }
}

interface IUserInfoStore {
    init: () => void
    cash: number
    balance: number
    myTrades: IMyTradeData
    updateInfo: () => void
}
const useUserInfoStore = create<IUserInfoStore>((set) => ({
    init: () => {
        getInitData().then((data) => {
            set(data)
        })
    },
    cash: 0,
    balance: 0,
    myTrades: {
        positions: [],
        orders: [],
    },
    updateInfo: async () => {
        set(await getInitData())
    },
}))

export default useUserInfoStore