'use client';

import useBreakpoint from '@/hooks/useBreakpoint';
import { useCryptoUi } from '@/hooks/useCryptoUi';
import { ModalDimmer } from '@/styles/MainStyles';
import BrowserUtils from '@/utils/BrowserUtils';
import { createPortal } from 'react-dom';
import CryptoMarketChartControlBar from '../chart/ControlBar';
import TradingChart from '../chart/TradingChart';
import CryptoMarketChartProvider from './MarketChartProvider';
import useIsClient from '@/hooks/useIsClient';

interface Props {
  marketCode: string;
}
export default function CryptoMarketMobileChart({ marketCode }: Props) {
  const { setIsShowMobileChart } = useCryptoUi();

  return (
    <Wrapper>
      <CryptoMarketChartProvider marketCode={marketCode}>
        <div className="flex flex-col w-[95vw] p-1.5 rounded-lg bg-slate-800" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center h-10 px-2">
            <span className="text-base font-semibold text-slate-100">차트</span>
            <button
              className="flex items-center justify-center size-6 rounded-full bg-slate-700"
              type="button"
              onClick={() => setIsShowMobileChart(false)}
            >
              <i className="fa-solid fa-x text-xs text-slate-400"></i>
            </button>
          </div>

          <CryptoMarketChartControlBar />

          <div className="relative h-[calc(100dvh-16rem)] select-none touch-none">
            <TradingChart marketCode={marketCode} />
          </div>
        </div>
      </CryptoMarketChartProvider>
    </Wrapper>
  );
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { isShowMobileChart, setIsShowMobileChart } = useCryptoUi();
  const { breakpointState } = useBreakpoint();
  const isClient = useIsClient();

  if (!isClient || breakpointState.md) return null;

  return createPortal(
    <ModalDimmer
      $is_active={isShowMobileChart}
      className="flex flex-center"
      onClick={() => setIsShowMobileChart(false)}
    >
      {isShowMobileChart && children}
    </ModalDimmer>,
    document.body,
  );
};
