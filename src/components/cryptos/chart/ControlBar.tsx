import UpbitApi from '@/apis/api/cryptos/UpbitApi'
import * as CS from '@/styles/CryptoChartStyles'
import { IUpbitCandle } from '@/types/cryptos/CryptoInterfaces'
import { CandleMinuteUnits } from '@/types/cryptos/CryptoTypes'
import { useEffect } from 'react'
import { CANDLE_SIZE, CandleTimeType, CandleTimes, ChartType, ChartTypes } from './Types'

interface ICryptoMarketChartControlBar {
  marketCode: string
  timeType: CandleTimeType
  setTimeType: (timeType: CandleTimeType) => void
  setCandles: (candles: IUpbitCandle[]) => void
  chartType: ChartType
  setChartType: (chartType: ChartType) => void
}
export default function CryptoMarketChartControlBar({
  marketCode,
  timeType,
  setTimeType,
  setCandles,
  chartType,
  setChartType,
}: ICryptoMarketChartControlBar) {
  useEffect(() => {
    getSeconds()
  }, [])

  const getSeconds = async () => {
    const candles = await UpbitApi.getCandleSeconds(marketCode, CANDLE_SIZE)
    setCandles(candles)
    setTimeType(CandleTimes.SECOND)
    setChartType(ChartTypes.AREA)
  }

  const getMinutes = async (_minute: CandleMinuteUnits = 1) => {
    const candles = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, _minute)
    setCandles(candles)

    if (_minute === 1) setTimeType(CandleTimes.MINUTE1)
    else if (_minute === 3) setTimeType(CandleTimes.MINUTE3)
    else if (_minute === 5) setTimeType(CandleTimes.MINUTE5)
    else if (_minute === 10) setTimeType(CandleTimes.MINUTE10)
    else if (_minute === 15) setTimeType(CandleTimes.MINUTE15)
    else setTimeType(CandleTimes.MINUTE1)
    setChartType(ChartTypes.CANDLE)
  }

  const getDays = async () => {
    const candles = await UpbitApi.getCandleDays(marketCode, CANDLE_SIZE)
    setCandles(candles)
    setTimeType(CandleTimes.DAY)
    setChartType(ChartTypes.CANDLE)
  }

  const getWeeks = async () => {
    const candles = await UpbitApi.getCandleWeeks(marketCode, CANDLE_SIZE)
    setCandles(candles)
    setTimeType(CandleTimes.WEEK)
    setChartType(ChartTypes.CANDLE)
  }

  const getMonths = async () => {
    const candles = await UpbitApi.getCandleMonths(marketCode, CANDLE_SIZE)
    setCandles(candles)
    setTimeType(CandleTimes.MONTH)
    setChartType(ChartTypes.CANDLE)
  }

  return (
    <CS.ControlBar>
      <button onClick={getSeconds} className={timeType === CandleTimes.SECOND ? 'active' : ''}>
        초
      </button>
      <button onClick={() => getMinutes(1)} className={timeType === CandleTimes.MINUTE1 ? 'active' : ''}>
        1분
      </button>
      <button onClick={() => getMinutes(15)} className={timeType === CandleTimes.MINUTE15 ? 'active' : ''}>
        15분
      </button>
      <button onClick={getDays} className={timeType === CandleTimes.DAY ? 'active' : ''}>
        일
      </button>
      <button onClick={getWeeks} className={timeType === CandleTimes.WEEK ? 'active' : ''}>
        주
      </button>
      <button onClick={getMonths} className={timeType === CandleTimes.MONTH ? 'active' : ''}>
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
