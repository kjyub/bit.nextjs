// store.js
import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import UserApi from '@/apis/api/users/UserApi';
import type { IMyTradeData } from '@/types/cryptos/CryptoInterfaces';
import CryptoWallet from '@/types/cryptos/CryptoWallet';
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
  isLoading: boolean;
  init: () => void;
  isAuth: boolean;
  cash: number;
  balance: number;
  locked: number;
  myTrades: IMyTradeData;
  updateAuth: (isAuth: boolean) => void;
  updateInfo: () => Promise<void>;
}
const useUserInfoStore = create<IUserInfoStore>((set, get) => ({
  isLoading: true,
  init: () => {
    if (get().isAuth) {
      set({ isLoading: true });
      getInitData().then((data) => {
        set(data);
        set({ isLoading: false });
      });
    }
  },
  isAuth: false,
  cash: 0,
  balance: 0,
  locked: 0,
  myTrades: {
    wallet: new CryptoWallet(),
    positions: [],
    orders: [],
  },
  updateAuth: (isAuth: boolean) => {
    set({ isAuth });
  },
  updateInfo: async () => {
    if (get().isAuth) {
      set({ isLoading: true });
      set(await getInitData());
      set({ isLoading: false });
    }
  },
}));

export default useUserInfoStore;
