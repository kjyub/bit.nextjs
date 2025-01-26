import CryptoApi from '@/apis/api/cryptos/CryptoApi'
import { IMyTradeData } from '@/types/cryptos/CryptoInterfaces'
import { create } from 'zustand'

const getInitData = async () => {
    return await CryptoApi.getMyTrades()
}

interface IMyTradeStore {
    myTrades: IMyTradeData
    update: () => void
}
const useMyTradeStore = create<IMyTradeStore>((set) => ({
    myTrades: {},
    update: () => {
        getInitData().then((data) => {
            set({
                myTrades: data
            })
        })
    },
}))

export default useMyTradeStore