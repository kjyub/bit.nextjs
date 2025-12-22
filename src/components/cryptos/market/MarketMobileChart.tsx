'use client';

import useBreakpoint from '@/hooks/useBreakpoint';
import { useCryptoUi } from '@/hooks/useCryptoUi';
import useIsClient from '@/hooks/useIsClient';
import CryptoMarketChartControlBar from '../chart/ControlBar';
import TradingChart from '../chart/TradingChart';
import ModalContainer from '@/components/ModalContainer';

interface Props {
  marketCode: string;
}
export default function CryptoMarketMobileChart({ marketCode }: Props) {
  const { setIsShowMobileChart } = useCryptoUi();

  return (
    <Wrapper>
      <div className="flex flex-col w-[98vw] h-[90dvh] p-2 rounded-lg bg-gray-900" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center h-10 px-2">
          <span className="text-base font-semibold text-surface-main-text">차트</span>
          <button
            className="flex items-center justify-center size-6 rounded-full bg-surface-chart-background"
            type="button"
            onClick={() => setIsShowMobileChart(false)}
          >
            <i className="fa-solid fa-x text-xs text-surface-sub-text"></i>
          </button>
        </div>

        <CryptoMarketChartControlBar />

        <div className="relative h-full p-1 select-none touch-none">
          <TradingChart marketCode={marketCode} />
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { isShowMobileChart, setIsShowMobileChart } = useCryptoUi();
  const { breakpointState } = useBreakpoint();
  const isClient = useIsClient();

  if (!isClient || breakpointState.md) return null;

  return (
    <ModalContainer isOpen={isShowMobileChart} setIsOpen={setIsShowMobileChart}>
      {children}
    </ModalContainer>
  );
};
