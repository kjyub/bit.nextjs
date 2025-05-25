// store.js
import TradeGoApi from "@/apis/api/cryptos/TradeGoApi";
import { IUpbitMarketTicker } from "@/types/cryptos/CryptoInterfaces";
import { create } from "zustand";

const getInitData = async () => {
  return await TradeGoApi.getMarketsCurrentDic();
};

interface IMarketPriceStore {
  marketDic: {
    [key: string]: IUpbitMarketTicker;
  };
  initMarketPriceData: () => Promise<void>;
  marketPriceSocket: WebSocket | null;
  connectMarketPriceSocket: () => void;
  disconnectMarketPriceSocket: () => void;
}
const useMarketPriceStore = create<IMarketPriceStore>((set, get) => ({
  marketDic: {},
  initMarketPriceData: async () => {
    const data = await getInitData();

    set({ marketDic: data });
  },
  connectMarketPriceSocket: () => {
    const socket = TradeGoApi.getMarketSocket();
    set({ marketPriceSocket: socket });

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        const marketTicker = data as IUpbitMarketTicker;

        if (!marketTicker.code) {
          return;
        }

        set((state) => ({
          ...state,
          marketDic: {
            ...state.marketDic,
            [marketTicker.code]: marketTicker,
          },
        }));
      } catch (error) {
        // console.log('Failed to parse WebSocket message', error)
      }
    };
  },
  disconnectMarketPriceSocket: () => {
    const socket = get().marketPriceSocket;

    if (socket) {
      socket.close();

      set({ marketPriceSocket: null });
    }
  },
}));

export default useMarketPriceStore;
