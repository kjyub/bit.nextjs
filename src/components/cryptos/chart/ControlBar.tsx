import { HelpBox } from '@/components/inputs/TradeInputs';
import * as CS from '@/styles/CryptoChartStyles';
import { CrosshairMode } from 'lightweight-charts';
import { useCryptoMarketChart } from '../market/CryptoMarketChartProvider';
import { CandleTimes, ChartTypes } from './Types';

export default function CryptoMarketChartControlBar() {
  const { timeType, chartType, setChartType, initChart, updateTradePrice, crosshairMode, setCrosshairMode } =
    useCryptoMarketChart();

  return (
    <CS.ControlBar>
      <div className="list">
        <button
          type="button"
          onClick={() => initChart(CandleTimes.SECOND)}
          className={timeType === CandleTimes.SECOND ? 'active' : ''}
        >
          초
        </button>
        <button
          type="button"
          onClick={() => initChart(CandleTimes.MINUTE1)}
          className={timeType === CandleTimes.MINUTE1 ? 'active' : ''}
        >
          1분
        </button>
        <button
          type="button"
          onClick={() => initChart(CandleTimes.MINUTE15)}
          className={timeType === CandleTimes.MINUTE15 ? 'active' : ''}
        >
          15분
        </button>
        <button
          type="button"
          onClick={() => initChart(CandleTimes.MINUTE60)}
          className={timeType === CandleTimes.MINUTE60 ? 'active' : ''}
        >
          1시간
        </button>
        <button
          type="button"
          onClick={() => initChart(CandleTimes.MINUTE240)}
          className={timeType === CandleTimes.MINUTE240 ? 'active' : ''}
        >
          4시간
        </button>
        <button
          type="button"
          onClick={() => initChart(CandleTimes.DAY)}
          className={timeType === CandleTimes.DAY ? 'active' : ''}
        >
          일
        </button>
        <button
          type="button"
          onClick={() => initChart(CandleTimes.WEEK)}
          className={timeType === CandleTimes.WEEK ? 'active' : ''}
        >
          주
        </button>
        <button
          type="button"
          onClick={() => initChart(CandleTimes.MONTH)}
          className={timeType === CandleTimes.MONTH ? 'active' : ''}
        >
          월
        </button>
      </div>

      <div className="max-sm:hidden split"></div>

      <div className="list max-sm:w-full">
        <button
          type="button"
          onClick={() => setChartType(ChartTypes.CANDLE)}
          className={chartType === ChartTypes.CANDLE ? 'active' : ''}
        >
          <i className="fa-solid fa-chart-column"></i>
        </button>
        <button
          type="button"
          onClick={() => setChartType(ChartTypes.AREA)}
          className={chartType === ChartTypes.AREA ? 'active' : ''}
        >
          <i className="fa-solid fa-chart-line"></i>
        </button>

        <div className="split"></div>

        <button
          type="button"
          onClick={() => setCrosshairMode(CrosshairMode.Normal)}
          className={crosshairMode === CrosshairMode.Normal ? 'active' : ''}
          title="십자선 자유 모드"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
        <button
          type="button"
          onClick={() => setCrosshairMode(CrosshairMode.Magnet)}
          className={crosshairMode === CrosshairMode.Magnet ? 'active' : ''}
          title="십자선 자석 모드"
        >
          <i className="fa-solid fa-magnet"></i>
        </button>

        <HelpBox className="[&>div]:w-32 h-6" position="right-bottom">
          <div className="[&>div]:flex [&>div]:items-center [&>div]:px-0.5 [&>div]:py-0.5 [&>div]:gap-1.5 max-md:[&_i]:text-xs md:[&_i]:text-sm max-md:[&_span]:text-xs md:[&_span]:text-sm [&_span]:text-slate-300">
            <div>
              <i className="fa-solid fa-chart-column"></i>
              <span>캔들 차트</span>
            </div>
            <div>
              <i className="fa-solid fa-chart-line"></i>
              <span>라인 차트</span>
            </div>
            <div>
              <i className="fa-solid fa-plus"></i>
              <span>십자선 자유 모드</span>
            </div>
            <div>
              <i className="fa-solid fa-magnet"></i>
              <span>십자선 자석 모드</span>
            </div>
          </div>
        </HelpBox>

        <div className="flex items-center gap-1 ml-auto">
          <button type="button" className="mouse:hidden text-sm" onClick={updateTradePrice}>
            <i className="fa-solid fa-money-bill-wave"></i>
          </button>
        </div>
      </div>
    </CS.ControlBar>
  );
}
