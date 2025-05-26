import { IUpbitCandle } from '@/types/cryptos/CryptoInterfaces'
import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'
import dayjs from 'dayjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AreaSeries,
  BarSeries,
  CandlestickSeries,
  Chart,
  ChartCanvas,
  CrossHairCursor,
  CurrentCoordinate,
  EdgeIndicator,
  LineSeries,
  MouseCoordinateX,
  MouseCoordinateY,
  XAxis,
  YAxis,
  ZoomButtons,
  discontinuousTimeScaleProviderBuilder,
  elderRay,
  ema,
  mouseBasedZoomAnchor,
} from 'react-financial-charts'
import { CandleTimeType, CandleTimes, ChartType, ChartTypes } from './Types'
import useBreakpoint from '@/hooks/useBreakpoint'

interface IElderRay {
  bearPower: number
  bullPower: number
}

interface IChartData {
  close: number
  open: number
  high: number
  low: number
  tradePrice: number
  timestamp: number
  volume: number
  date: Date
  datetime: string
  elderRay: IElderRay
}

const WIDTH = 944
const PADDING_WIDTH = 48
const TRADE_WIDTH = 280
const HEIGHT_DESKTOP = 540
const HEIGHT_MOBILE = 360
const CHART_HEIGHT_DESKTOP = 420
const CHART_HEIGHT_MOBILE = 240
const VOLUME_CHART_HEIGHT = 62
const MARGIN = { left: 0, right: 100, top: 12, bottom: 12 }

const AXIS_COLOR = 'oklch(0.554 0.046 257.417 / 0.3)'
const TEXT_COLOR = '#cad5e2'

const EMA12_COLOR = '#adb71c'
const EMA26_COLOR = '#15bd39'

const AREA_STROKE_COLOR = '#7f22fe'
const areaGradient = (ctx: CanvasRenderingContext2D, _moreProps: any) => {
  const areaGradient = ctx.createLinearGradient(0, 0, 0, CHART_HEIGHT_DESKTOP)
  areaGradient.addColorStop(0, 'rgba(127, 34, 2547, 0.95)')
  areaGradient.addColorStop(1, 'rgba(127, 34, 2547, 0.1)')

  return areaGradient
}

const FONT_FAMILY = 'Pretendard'

const COORDINATE_FILL = '#45556c'
const COORDINATE_TEXT = '#e2e8f0'
const COORDINATE_TEXT_SIZE = 13

const ZOOM_FILL = '#45556c'
const ZOOM_FILL_OPACITY = 0.8
const ZOOM_STROKE = '#62748e'
const ZOOM_STROKE_OPACITY = 0.1
const ZOOM_TEXT = '#90a1b9'
const ZOOM_BUTTON_SIZE = 16

interface TimeScaleProvider {
  data: any[]
  xScale: any
  xAccessor: (data: any) => number
  displayXAccessor: (data: any) => number
}
const ScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: IChartData) => {
  try {
    return d.date
  } catch {
    console.error('date error', d)
    return new Date()
  }
})

const candleChartExtents = (data: object): number[] => {
  return [data.high, data.low]
}

const pricesDisplayFormat = format(',')

const parseCandleToChart = (datas: IUpbitCandle[]): object[] => {
  const parseData = []
  for (const data of datas) {
    if (data.candle_date_time_kst && data.timestamp) {
      parseData.push({
        close: data.trade_price,
        open: data.opening_price,
        high: data.high_price,
        low: data.low_price,
        tradePrice: data.candle_acc_trade_price,
        timestamp: data.timestamp,
        volume: data.candle_acc_trade_volume,
        date: new Date(data.candle_date_time_kst),
        datetime: dayjs(data.candle_date_time_kst).format('YYYY-MM-DD HH:mm:ss'),
      })
    }
  }

  return parseData.toReversed()
}
const ema12 = ema()
  .id(1)
  .options({ windowSize: 12 })
  .merge((d: IChartData, c: number) => {
    d.ema12 = c
  })
  .accessor((d: IChartData) => {
    try {
      return d.ema12
    } catch {
      return null
    }
  })
  .stroke(EMA12_COLOR)

const ema26 = ema()
  .id(2)
  .options({ windowSize: 26 })
  .merge((d: IChartData, c: number) => {
    d.ema26 = c
  })
  .accessor((d: IChartData) => {
    try {
      return d.ema26
    } catch {
      return null
    }
  })
  .stroke(EMA26_COLOR)

const elder = elderRay()

const yEdgeIndicator = (data: IChartData): number => {
  return data.close
}

const positionColor = (data: IChartData) => {
  return data.close > data.open ? '#3b69cb' : '#c43a3a'
}

const parseCandleData = (candles: IUpbitCandle[]): [TimeScaleProvider, number[]] => {
  const parsedData = parseCandleToChart(candles)

  let chartData = parsedData

  try {
    const _ema12 = ema12(parsedData)
    const _ema26 = ema26(_ema12 as object[])
    const _elder = elder(_ema26 as object[])
    chartData = elder(_elder as object[])
  } catch {
    //
  }

  const scaleData = ScaleProvider(chartData as any[])
  const { data, xScale, xAccessor, displayXAccessor } = scaleData

  const max = xAccessor(data[Math.min(199, data.length - 1)])
  const min = xAccessor(data.length < 50 ? 0 : data[Math.min(50, Math.floor(data.length / 2))])
  const xExtents = [min, max + 5]

  return [scaleData, xExtents]
}

const volumeSeries = (data: IChartData): IChartData => {
  return data.volume
}

const volumeChartOrigin = (_: number, h: number) => [0, h - VOLUME_CHART_HEIGHT - 8]

interface ICryptoMarketFinancialChart {
  timeType: CandleTimeType
  chartType: ChartType
  candles: IUpbitCandle[]
  getBeforeData: () => Promise<void>
}
export default function CryptoMarketFinancialChart({
  timeType,
  chartType,
  candles,
  getBeforeData,
}: ICryptoMarketFinancialChart) {
  const chartCanvasRef = useRef<ChartCanvas | null>(null)

  const { breakpointState, width: windowWidth } = useBreakpoint();
  const [width, setWidth] = useState(WIDTH);
  const [height, setHeight] = useState(HEIGHT_DESKTOP);
  const [chartHeight, setChartHeight] = useState(CHART_HEIGHT_DESKTOP);

  const [{ data, xScale, xAccessor, displayXAccessor }, setScaleData] = useState<TimeScaleProvider>({})
  const [xExtents, setXExtents] = useState<number[]>([0, 0])

  useEffect(() => {
    if (!breakpointState.sm) {
      setWidth(windowWidth - PADDING_WIDTH)
      setHeight(HEIGHT_MOBILE)
      setChartHeight(CHART_HEIGHT_MOBILE)
    } else if (breakpointState.sm && !breakpointState.md) {
      setWidth(windowWidth - PADDING_WIDTH)
      setHeight(HEIGHT_MOBILE)
      setChartHeight(CHART_HEIGHT_MOBILE)
    } else if (breakpointState.md && !breakpointState.lg) {
      setWidth(768 - PADDING_WIDTH - TRADE_WIDTH)
      setHeight(HEIGHT_DESKTOP)
      setChartHeight(CHART_HEIGHT_DESKTOP)
    } else if (breakpointState.lg && !breakpointState.xl) {
      setWidth(1024 - PADDING_WIDTH - TRADE_WIDTH)
      setHeight(HEIGHT_DESKTOP)
      setChartHeight(CHART_HEIGHT_DESKTOP)
    } else {
      setWidth(WIDTH)
      setHeight(HEIGHT_DESKTOP)
      setChartHeight(CHART_HEIGHT_DESKTOP)
    }
  }, [breakpointState, windowWidth])

  useEffect(() => {
    if (!chartCanvasRef.current) {
      return
    }
  }, [chartCanvasRef.current])

  useEffect(() => {
    const [_scaleData, _xExtends] = parseCandleData(candles)
    setScaleData(_scaleData)
    setXExtents(_xExtends)
  }, [candles])

  const timeTickFormat = useCallback(
    (index: number | Date) => {
      const candleData: IChartData = data[index] as IChartData
      if (!candleData || !candleData.date) {
        return `-`
      }
      const date = new Date(candleData.date)

      if (timeType === CandleTimes.SECOND) {
        return `${timeFormat('%H:%M:%S')(date)}`
      } else if (timeType.endsWith('m')) {
        return `${timeFormat('%H:%M')(date)}`
      } else if (timeType === CandleTimes.DAY) {
        return `${timeFormat('%m/%d')(date)}`
      } else if (timeType === CandleTimes.WEEK) {
        return `${timeFormat('%y/%m/%d')(date)}`
      } else {
        return `${timeFormat('%y/%m')(date)}`
      }
    },
    [timeType, data],
  )

  const onLoadBefore = useCallback(
    async (start: number | Date, end: number | Date) => {
      if (!chartCanvasRef.current) {
        return
      }

      const newData = await getBeforeData()
      // console.log("current", chartCanvasRef.current.props.data.length, chartCanvasRef.current, start, end)
    },
    [getBeforeData],
  )

  if (!data) {
    return <></>
  }

  return (
    <ChartCanvas
      key={timeType}
      ref={chartCanvasRef}
      width={width}
      height={height}
      margin={MARGIN}
      ratio={2}
      padding={{ left: 0, right: 48, top: 24, bottom: 24 }}
      zoomMultiplier={0.01}
      data={data}
      displayXAccessor={displayXAccessor}
      seriesName="Data"
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
      disableInteraction={false}
      zoomAnchor={mouseBasedZoomAnchor}
      onLoadBefore={onLoadBefore}
    >
      <Chart id="crypto-chart-candle" className="text-violet-600" height={chartHeight} yExtents={candleChartExtents}>
        <XAxis
          showGridLines
          showTickLabel={true}
          tickFormat={timeTickFormat}
          strokeStyle={AXIS_COLOR}
          strokeWidth={2}
          innerTickSize={4}
          gridLinesStrokeStyle={AXIS_COLOR}
          tickStrokeStyle={TEXT_COLOR}
          tickLabelFill={TEXT_COLOR}
        />
        <YAxis
          showGridLines
          tickFormat={pricesDisplayFormat}
          strokeStyle={AXIS_COLOR}
          strokeWidth={2}
          gridLinesStrokeStyle={AXIS_COLOR}
          tickStrokeStyle={TEXT_COLOR}
          tickLabelFill={TEXT_COLOR}
        />
        {chartType === ChartTypes.CANDLE && <CandlestickSeries fill={positionColor} wickStroke={positionColor} />}
        {chartType === ChartTypes.AREA && (
          <AreaSeries
            yAccessor={(d: IChartData) => d.open}
            strokeWidth={1.5}
            strokeStyle={AREA_STROKE_COLOR}
            fillStyle={areaGradient}
          />
        )}
        <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} />
        <CurrentCoordinate yAccessor={ema26.accessor()} fillStyle={ema26.stroke()} />
        <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
        <CurrentCoordinate yAccessor={ema12.accessor()} fillStyle={ema12.stroke()} />
        <MouseCoordinateY
          rectWidth={MARGIN.right}
          fill={COORDINATE_FILL}
          textFill={COORDINATE_TEXT}
          fontSize={COORDINATE_TEXT_SIZE}
          fontFamily={FONT_FAMILY}
          displayFormat={pricesDisplayFormat}
        />
        <EdgeIndicator
          itemType="last"
          rectWidth={MARGIN.right}
          fill={positionColor}
          lineStroke={positionColor}
          displayFormat={pricesDisplayFormat}
          yAccessor={yEdgeIndicator}
        />
        {/* <MovingAverageTooltip
                    origin={[8, 24]}
                    labelFill={"#90a1b9"}
                    textFill={"#cad5e2"}
                    width={80}
                    options={[
                        {
                            yAccessor: ema26.accessor(),
                            type: "EMA",
                            stroke: ema26.stroke(),
                            windowSize: ema26.options().windowSize,
                        },
                        {
                            yAccessor: ema12.accessor(),
                            type: "EMA",
                            stroke: ema12.stroke(),
                            windowSize: ema12.options().windowSize,
                        },
                    ]}
                /> */}

        <ZoomButtons
          fill={ZOOM_FILL}
          fillOpacity={ZOOM_FILL_OPACITY}
          stroke={ZOOM_STROKE}
          strokeOpacity={ZOOM_STROKE_OPACITY}
          textFill={ZOOM_TEXT}
          r={ZOOM_BUTTON_SIZE}
        />
      </Chart>
      <Chart id={'VolumeChart'} height={VOLUME_CHART_HEIGHT} yExtents={volumeSeries} origin={volumeChartOrigin}>
        <XAxis showGridLines strokeStyle={AXIS_COLOR} gridLinesStrokeStyle={AXIS_COLOR} showTickLabel={false} />
        <YAxis ticks={4} strokeStyle={AXIS_COLOR} gridLinesStrokeStyle={AXIS_COLOR} tickLabelFill={TEXT_COLOR} />
        <BarSeries fillStyle={positionColor} yAccessor={volumeSeries} />

        <MouseCoordinateX
          fill={COORDINATE_FILL}
          textFill={COORDINATE_TEXT}
          fontSize={COORDINATE_TEXT_SIZE}
          fontFamily={FONT_FAMILY}
          displayFormat={timeFormat('%y-%m-%d %H:%M')}
        />
        <MouseCoordinateY
          rectWidth={MARGIN.right}
          fill={COORDINATE_FILL}
          textFill={COORDINATE_TEXT}
          fontSize={COORDINATE_TEXT_SIZE}
          fontFamily={FONT_FAMILY}
          displayFormat={pricesDisplayFormat}
        />
      </Chart>

      <CrossHairCursor strokeWidth={0.8} strokeDasharray={'Solid'} strokeStyle={TEXT_COLOR} />
    </ChartCanvas>
  )
}
