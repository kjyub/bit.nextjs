'use client';

import NextUpbitApi from '@/apis/api/cryptos/NextUpbitApi';
import useTradeMarketOrderBookSocket from '@/hooks/sockets/useTradeMarketOrderBookSocket';
import useBreakpoint from '@/hooks/useBreakpoint';
import { useCryptoUi } from '@/hooks/useCryptoUi';
import type { IUpbitMarketTicker, IUpbitOrderBook } from '@/types/cryptos/CryptoInterfaces';
import { useCallback, useEffect, useState } from 'react';
import OrderBook from '../orderbook/OrderBook';
import CryptoMarketChart from './MarketChart';
import { useCryptoMarketChart } from './MarketChartProvider';

interface ICryptoMarketOrderBook {
  marketCode: string;
  marketCurrent: IUpbitMarketTicker;
}
export default function CryptoMarketOrderBook({ marketCode, marketCurrent }: ICryptoMarketOrderBook) {
  const { isOrderBookLoading: isLoading, orderBook } = useCryptoMarketChart();
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [orderBook, setOrderBook] = useState<IUpbitOrderBook>({} as IUpbitOrderBook);

  const { isShowMobileChart, setIsShowMobileChart } = useCryptoUi();
  const [isShowChart, setIsShowChart] = useState<boolean>(false);
  const { breakpointState } = useBreakpoint();
  const isTablet = breakpointState.md && !breakpointState.lg;

  // useEffect(() => {
  //   initChart();
  // }, [marketCode]);

  useEffect(() => {
    if (!isTablet) {
      setIsShowChart(false);
    }
  }, [isTablet]);

  // const initChart = useCallback(async () => {
  //   await getOrderBook();
  //   connectChart(marketCode);
  // }, [marketCode]);

  // const getOrderBook = useCallback(async () => {
  //   if (isLoading) {
  //     return;
  //   }

  //   setIsLoading(true);
  //   const orderBook = await NextUpbitApi.getOrderBook(marketCode);
  //   setOrderBook(orderBook);
  //   setIsLoading(false);
  // }, [marketCode]);

  const handleShowChart = useCallback(() => {
    if (isTablet) {
      setIsShowChart(!isShowChart);
    } else {
      setIsShowMobileChart(!isShowMobileChart);
    }
  }, [isTablet, isShowChart, isShowMobileChart]);

  // const connectChart = useTradeMarketOrderBookSocket(marketCode, setOrderBook);

  return (
    <div className="relative flex flex-col size-full">
      {!isShowChart && orderBook && Object.keys(orderBook).length > 0 && (
        <div className="flex flex-col justify-between size-full max-lg:pb-1 lg:pb-2">
          <div className="flex items-start w-full h-8 pt-1.5 shrink-0 border-b border-slate-500/50">
            <span className="font-medium max-lg:leading-3">{isShowChart ? '차트' : '호가'}</span>
          </div>
          <OrderBook orderBook={orderBook} marketCode={marketCode} marketCurrent={marketCurrent} />
        </div>
      )}

      {isShowChart && (
        <div className="w-full h-full">
          <CryptoMarketChart marketCode={marketCode} />
        </div>
      )}

      {/* 상태 변경 */}
      <button
        className="absolute top-0 right-0 lg:hidden px-1 py-1 text-slate-300/70 active:text-slate-100/90 transition-colors"
        type="button"
        onClick={handleShowChart}
      >
        <i className="fa-solid fa-chart-line"></i>
      </button>
    </div>
  );
}
