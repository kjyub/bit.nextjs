import * as CS from '@/styles/CryptoChartStyles';
import { useCryptoMarketChart } from '../market/CryptoMarketChartProvider';
import { CandleTimes, ChartTypes } from './Types';

export default function CryptoMarketChartControlBar() {
  const { timeType, chartType, setChartType, initChart, updateTradePrice } = useCryptoMarketChart();

  return (
    <CS.ControlBar>
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

      <div className="split"></div>

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

      <div className="flex items-center gap-1 ml-auto">
        <button type="button" className="mouse:hidden text-sm" onClick={updateTradePrice}>
          <i className="fa-solid fa-money-bill-wave"></i>
        </button>
      </div>
    </CS.ControlBar>
  );
}
