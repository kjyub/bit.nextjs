// store.js
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import { create } from 'zustand';

const getInitData = async () => {
  return await TradeGoApi.getMarketsCurrentDic();
};

interface IMarketPriceStore {
  marketDic: Record<string, IUpbitMarketTicker>;
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
  marketPriceSocket: null,
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

        const currentMarketDic = get().marketDic;
        if (currentMarketDic[marketTicker.code]?.trade_price === marketTicker.trade_price) {
          return;
        }

        set((state) => ({
          marketDic: {
            ...state.marketDic,
            [marketTicker.code]: marketTicker,
          },
        }));
      } catch {
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
