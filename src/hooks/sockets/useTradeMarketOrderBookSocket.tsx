'use client';

import type { IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import useSocketManager from './useSocketManager';

export default function useTradeMarketOrderBookSocket(marketCode: string, receive: (data: IUpbitOrderBook) => void) {
  const socketRef = useRef<WebSocket | null>(null);

  useSocketManager(
    () => {
      setTimeout(() => {
        connectChart(marketCode);
      }, 1000);
    },
    () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    },
  );

  const connectChart = async (marketCode: string) => {
    if (socketRef.current) {
      console.log('[호가] 기존 연결 종료');
      socketRef.current.close();
    }

    const newSocket = new WebSocket('wss://api.upbit.com/websocket/v1');
    newSocket.binaryType = 'arraybuffer';
    console.log('[호가] 연결 시작');
    newSocket.onmessage = (event: MessageEvent) => {
      try {
        const dataString = new TextDecoder('utf-8').decode(event.data as any);
        const data = JSON.parse(dataString as string);
        if (data.error) {
          console.error('[호가] WebSocket error:', data);
          return;
        }
        const orderBookData = data as IUpbitOrderBook;
        receive(orderBookData);
      } catch (error) {
        console.error('[호가] Failed to parse WebSocket message', error);
      }
    };
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      const ticket = String(uuid());
      const requestData = [{ ticket: ticket }, { type: 'orderbook', codes: [marketCode] }];
      newSocket.send(JSON.stringify(requestData));
    };

    newSocket.onclose = () => {
      console.log('[호가] 연결 종료');
    };

    newSocket.onerror = (event) => {
      console.error('[호가] WebSocket error:', event);
    };
  };

  return connectChart;
}
