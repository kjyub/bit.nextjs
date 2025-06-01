'use client';

import useTradeMarketOrderBookSocket from '@/hooks/sockets/useTradeMarketOrderBookSocket';
import { IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import { useCallback, useEffect, useState } from 'react';

interface ICryptoMarketOrderBook {
  marketCode: string;
}
export default function CryptoMarketOrderBook({ marketCode }: ICryptoMarketOrderBook) {
  const [isOrderBookLoading, setOrderBookLoading] = useState<boolean>(false);
  const [orderBooks, setOrderBooks] = useState<IUpbitOrderBook[]>([]);

  useEffect(() => {
    initChart();
  }, [marketCode]);

  const initChart = useCallback(() => {
    connectChart(marketCode);
  }, [marketCode]);

  const addOrderBook = useCallback((orderBook: IUpbitOrderBook) => {
    setOrderBooks((orderBooks) => {
      return [...orderBooks, orderBook];
    });
  }, []);

  const connectChart = useTradeMarketOrderBookSocket(marketCode, addOrderBook);

  return (
    <div className="flex flex-col h-full">
      {orderBooks.length}
    </div>
  );
}
