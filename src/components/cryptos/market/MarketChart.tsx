'use client';

import CryptoMarketChartControlBar from '../chart/ControlBar';
import TradingChart from '../chart/TradingChart';

interface ICryptoMarketChart {
  marketCode: string;
}
export default function CryptoMarketChart({ marketCode }: ICryptoMarketChart) {
  return (
    <div className="flex flex-col h-full gap-2">
      <CryptoMarketChartControlBar />

      <div className="relative h-full select-none touch-none">
        <TradingChart marketCode={marketCode} />
      </div>
    </div>
  );
}
