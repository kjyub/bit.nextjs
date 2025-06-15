'use client';

import { type CandleTimeType, CandleTimes } from '@/components/cryptos/chart/Types';
import type { IUpbitCandle, IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import { useCallback, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import useSocketManager from './useSocketManager';

export default function useTradeMarketUpbitSocket(
  marketCode: string,
  receiveCandle: (data: IUpbitCandle, timeType: CandleTimeType) => void,
  receiveOrderBook: (data: IUpbitOrderBook) => void,
) {
  const socketRef = useRef<WebSocket | null>(null);

  useSocketManager(
    () => {
      connectChart(marketCode, CandleTimes.SECOND);
    },
    () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    },
    marketCode,
  );

  const connectChart = useCallback(async (marketCode: string, timeType: CandleTimeType) => {
    if (socketRef.current) {
      console.log('[업비트] 기존 연결 종료');
      socketRef.current.close();
    }

    const newSocket = new WebSocket('wss://api.upbit.com/websocket/v1');
    newSocket.binaryType = 'arraybuffer';
    console.log('[업비트] 연결 시작');
    newSocket.onmessage = (event: MessageEvent) => {
      try {
        const dataString = new TextDecoder('utf-8').decode(event.data as any);
        const data = JSON.parse(dataString as string);
        console.log('[업비트] data', data);
        if (data.error) {
          console.error('[업비트] WebSocket error:', data);
          return;
        }

        if (data.type.includes('candle')) {
          const candleData = data as IUpbitCandle;
          receiveCandle(candleData, timeType);
        } else if (data.type.includes('orderbook')) {
          const orderBookData = data as IUpbitOrderBook;
          receiveOrderBook(orderBookData);
        }
      } catch (error) {
        console.error('[업비트] Failed to parse WebSocket message', error);
      }
    };
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      const ticket = String(uuid());
      const requestData = [
        { ticket: ticket },
        { type: 'candle.1s', codes: [marketCode] },
        { type: 'orderbook', codes: [marketCode] },
      ];
      console.log('[업비트] ticket', requestData);
      newSocket.send(JSON.stringify(requestData));
    };

    newSocket.onclose = (event) => {
      console.log('[업비트] 연결 종료', event, event.reason);
    };

    newSocket.onerror = (event) => {
      console.error('[업비트] WebSocket error:', event);
    };
  }, [marketCode, receiveCandle, receiveOrderBook]);

  return connectChart;
}
