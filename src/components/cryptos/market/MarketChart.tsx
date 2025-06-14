'use client';

import dynamic from 'next/dynamic';
import CryptoMarketChartControlBar from '../chart/ControlBar';
import TradingChart from '../chart/TradingChart';
import CryptoMarketChartProvider from './MarketChartProvider';

// const CryptoMarketFinancialChart = dynamic(() => import('../chart/Chart'), { ssr: false });

interface ICryptoMarketChart {
  marketCode: string;
}
export default function CryptoMarketChart({ marketCode }: ICryptoMarketChart) {
  return (
    // <CryptoMarketChartProvider marketCode={marketCode}>
      <div className="flex flex-col h-full gap-2">
        <CryptoMarketChartControlBar />

        <div className="relative h-full select-none touch-none">
          {/* <CryptoMarketFinancialChart /> */}
          <TradingChart marketCode={marketCode} />
        </div>
      </div>
    // </CryptoMarketChartProvider>
  );
}
