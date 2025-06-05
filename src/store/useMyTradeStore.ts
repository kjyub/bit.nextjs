import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import type { IMyTradeData } from '@/types/cryptos/CryptoInterfaces';
import CryptoWallet from '@/types/cryptos/CryptoWallet';
import { create } from 'zustand';

const getInitData = async () => {
  return await CryptoApi.getMyTrades();
};

interface IMyTradeStore {
  myTrades: IMyTradeData;
  update: () => void;
}
const useMyTradeStore = create<IMyTradeStore>((set) => ({
  myTrades: {
    wallet: new CryptoWallet(),
    positions: [],
    orders: [],
  },
  update: () => {
    getInitData().then((data) => {
      set({
        myTrades: data,
      });
    });
  },
}));

export default useMyTradeStore;
