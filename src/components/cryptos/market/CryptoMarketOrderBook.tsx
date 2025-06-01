'use client';

import UpbitApi from '@/apis/api/cryptos/UpbitApi';
import useTradeMarketOrderBookSocket from '@/hooks/sockets/useTradeMarketOrderBookSocket';
import { IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import { useCallback, useEffect, useState } from 'react';
import OrderBook from '../orderbook/OrderBook';

interface ICryptoMarketOrderBook {
  marketCode: string;
  marketCurrent: IUpbitMarketTicker;
}
export default function CryptoMarketOrderBook({ marketCode, marketCurrent }: ICryptoMarketOrderBook) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderBook, setOrderBook] = useState<IUpbitOrderBook>({});

  useEffect(() => {
    initChart();
  }, [marketCode]);

  const initChart = useCallback(async () => {
    await getOrderBook();
    connectChart(marketCode);
  }, [marketCode]);

  const getOrderBook = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const orderBook = await UpbitApi.getOrderBook(marketCode);
    setOrderBook(orderBook);
    setIsLoading(false);
  }, [marketCode]);

  const addOrderBook = useCallback((orderBook: IUpbitOrderBook) => {
    setOrderBook(orderBook);
  }, []);

  const connectChart = useTradeMarketOrderBookSocket(marketCode, addOrderBook);

  return (
    <div className="flex flex-col size-full">
      <div className="flex w-full shrink-0 max-md:pb-1 md:pb-2 border-b border-slate-500/50">
        <span className="px-0 py-1 font-medium max-md:leading-3">호가</span>
      </div>
      {orderBook && Object.keys(orderBook).length > 0 && <OrderBook orderBook={orderBook} marketCode={marketCode} marketCurrent={marketCurrent} />}
    </div>
  );
}
