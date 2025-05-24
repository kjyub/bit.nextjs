// store.js
import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import UserApi from '@/apis/api/users/UserApi';
import { IMyTradeData } from '@/types/cryptos/CryptoInterfaces';
import { create } from 'zustand';

const getInitData = async () => {
  const wallet = await CryptoApi.getWallet();
  const user = await UserApi.getUserCurrent();

  const myTrades = await CryptoApi.getMyTrades();

  return {
    cash: user.cash,
    balance: wallet.balance,
    locked: wallet.locked,
    myTrades: myTrades,
  };
};

interface IUserInfoStore {
  init: () => void;
  cash: number;
  balance: number;
  locked: number;
  myTrades: IMyTradeData;
  updateInfo: () => Promise<void>;
}
const useUserInfoStore = create<IUserInfoStore>((set) => ({
  init: () => {
    getInitData().then((data) => {
      set(data);
    });
  },
  cash: 0,
  balance: 0,
  locked: 0,
  myTrades: {
    positions: [],
    orders: [],
  },
  updateInfo: async () => {
    set(await getInitData());
  },
}));

export default useUserInfoStore;
