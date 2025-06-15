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
  receiveMarketData: (marketTicker: IUpbitMarketTicker) => void;
  receiveCandle: (data: IUpbitCandle) => void;
  setReceiveCandle: (receiveCandle: (data: IUpbitCandle) => void) => void;
  receiveOrderBook: (data: IUpbitOrderBook) => void;
  setReceiveOrderBook: (receiveOrderBook: (data: IUpbitOrderBook) => void) => void;
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
        if (data.type === 'ticker') {
          get().receiveMarketData(data as IUpbitMarketTicker);
        } else if (data.type === 'orderbook') {
          get().receiveOrderBook(data as IUpbitOrderBook);
        } else if (data.type === 'candle.1s') {
          get().receiveCandle(data as IUpbitCandle);
        }
      } catch (error) {
        console.error('[거래:마켓] Failed to parse WebSocket message', error);
      }
    };

    socket.onmessage = handleMessage;
    socket.onopen = () => {
      console.log('[거래:마켓] 연결 시작');
      const ticket = String(uuid());
      const request: TradeSocketRequest[] = [
        {
          ticket: ticket,
        },
        {
          type: 'ticker',
          codes: [],
          action: 'subscribe',
        },
      ];
      socket.send(JSON.stringify(request));
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
  receiveMarketData: (marketTicker: IUpbitMarketTicker) => {
    if (!marketTicker.code) {
      return;
    }

    set((state) => ({
      marketDic: {
        ...state.marketDic,
        [marketTicker.code]: marketTicker,
      },
    }));
  },
  receiveCandle: (data: IUpbitCandle) => {},
  setReceiveCandle: (receiveCandle: (data: IUpbitCandle) => void) => {
    set({ receiveCandle: receiveCandle });
  },
  receiveOrderBook: (data: IUpbitOrderBook) => {},
  setReceiveOrderBook: (receiveOrderBook: (data: IUpbitOrderBook) => void) => {
    set({ receiveOrderBook: receiveOrderBook });
  },
}));

export default useMarketPriceStore;
