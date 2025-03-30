export const CANDLE_SIZE = 200

export const CandleTimes = {
  SECOND: '1s',
  MINUTE1: '1m',
  MINUTE3: '3m',
  MINUTE5: '5m',
  MINUTE10: '10m',
  MINUTE15: '15m',
  DAY: '1d',
  WEEK: '1w',
  MONTH: '1month',
} as const
export type CandleTimeType = (typeof CandleTimes)[keyof typeof CandleTimes]

export const ChartTypes = {
  AREA: 'AREA',
  CANDLE: 'CANDLE',
  BAR: 'BAR',
} as const
export type ChartType = (typeof ChartTypes)[keyof typeof ChartTypes]
