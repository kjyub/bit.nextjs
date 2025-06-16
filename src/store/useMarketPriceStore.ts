// store.js
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import type { IUpbitCandle, IUpbitMarketTicker, IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import type { TradeSocketRequest } from '@/types/cryptos/CryptoTypes';
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';

const getInitData = async () => {
  return await TradeGoApi.getMarketsCurrentDic();
};

interface IMarketPriceStore {
  marketDic: Record<string, IUpbitMarketTicker>;
  initMarketPriceData: () => Promise<void>;
  socket: WebSocket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  subscribeMarket: (marketCode: string) => void;
  unsubscribeMarket: (marketCode: string) => void;
}

const useMarketPriceStore = create<IMarketPriceStore>((set, get) => ({
  marketDic: {},
  initMarketPriceData: async () => {
    const data = await getInitData();
    set({ marketDic: data });
  },
  socket: null,
  connectSocket: () => {
    const socket = TradeGoApi.getMarketSocket();
    set({ socket: socket });

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        if (!data.code) return;

        if (data.type === 'ticker') {
          const marketTicker = data as IUpbitMarketTicker;
          set((state) => ({
            marketDic: {
              ...state.marketDic,
              [marketTicker.code]: marketTicker,
            },
          }));
        }
      } catch (error) {
        console.error('[거래:마켓] Failed to parse WebSocket message', error);
      }
    };

    socket.onmessage = handleMessage;
    socket.onopen = () => {
      console.log('[거래:마켓] 연결 시작');
    };

    socket.onclose = () => {
      console.log('[거래:마켓] 연결 종료');
    };

    socket.onerror = (event) => {
      console.error('[거래:마켓] WebSocket error:', event);
    };
  },
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.close();
      set({ socket: null });
    }
  },
  subscribeMarket: (marketCode: string) => {
    const socket = get().socket;
    if (!socket) return;
    if (!marketCode) return;

    const request: TradeSocketRequest[] = [
      {
        type: 'candle.1s',
        codes: [marketCode],
        action: 'subscribe',
      },
      {
        type: 'orderbook',
        codes: [marketCode],
        action: 'subscribe',
      },
    ];
    console.log('[거래:마켓] 시세 구독 요청', request);
    socket.send(JSON.stringify(request));
  },
  unsubscribeMarket: (marketCode: string) => {
    const socket = get().socket;
    if (!socket) return;
    if (!marketCode) return;

    const request: TradeSocketRequest[] = [
      {
        type: 'candle.1s',
        codes: [marketCode],
        action: 'unsubscribe',
      },
      {
        type: 'orderbook',
        codes: [marketCode],
        action: 'unsubscribe',
      },
    ];
    console.log('[거래:마켓] 시세 구독 해지 요청', request);
    socket.send(JSON.stringify(request));
  },
}));

export default useMarketPriceStore;
