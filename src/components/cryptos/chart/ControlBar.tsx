import * as CS from '@/styles/CryptoChartStyles'
import { CandleTimeType, CandleTimes, ChartType, ChartTypes } from './Types'

interface ICryptoMarketChartControlBar {
  timeType: CandleTimeType
  chartType: ChartType
  setChartType: (chartType: ChartType) => void
  initChart: (timeType: CandleTimeType) => Promise<void>
}
export default function CryptoMarketChartControlBar({
  timeType,
  chartType,
  setChartType,
  initChart,
}: ICryptoMarketChartControlBar) {
  return (
    <CS.ControlBar>
      <button onClick={() => initChart(CandleTimes.SECOND)} className={timeType === CandleTimes.SECOND ? 'active' : ''}>
        초
      </button>
      <button
        onClick={() => initChart(CandleTimes.MINUTE1)}
        className={timeType === CandleTimes.MINUTE1 ? 'active' : ''}
      >
        1분
      </button>
      <button
        onClick={() => initChart(CandleTimes.MINUTE15)}
        className={timeType === CandleTimes.MINUTE15 ? 'active' : ''}
      >
        15분
      </button>
      <button onClick={() => initChart(CandleTimes.DAY)} className={timeType === CandleTimes.DAY ? 'active' : ''}>
        일
      </button>
      <button onClick={() => initChart(CandleTimes.WEEK)} className={timeType === CandleTimes.WEEK ? 'active' : ''}>
        주
      </button>
      <button onClick={() => initChart(CandleTimes.MONTH)} className={timeType === CandleTimes.MONTH ? 'active' : ''}>
        월
      </button>

      <div className="split"></div>

      <button
        onClick={() => setChartType(ChartTypes.CANDLE)}
        className={chartType === ChartTypes.CANDLE ? 'active' : ''}
      >
        <i className="fa-solid fa-chart-column"></i>
      </button>
      <button onClick={() => setChartType(ChartTypes.AREA)} className={chartType === ChartTypes.AREA ? 'active' : ''}>
        <i className="fa-solid fa-chart-line"></i>
      </button>
    </CS.ControlBar>
  )
}
