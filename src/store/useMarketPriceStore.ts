// store.js
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import { create } from 'zustand';
import { debounce } from 'lodash';

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

    const handleMessage = debounce((event: MessageEvent) => {
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
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
      }
    }, 100); // 100ms 딜레이

    socket.onmessage = handleMessage;
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
