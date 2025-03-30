import TradeOrder from './TradeOrder'
import TradePosition from './TradePosition'

export interface IMarketPrice {
  marketCode: string
  price: number
}

export interface IUpbitMarket {
  market: string
  korean_name: string
  english_name: string
  market_event: {
    warning: boolean
    caution: object
  }
}
export interface IUpbitMarketTicker {
  code: string
  market: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  change: string
  change_price: number
  change_rate: number
  signed_change_price: number
  signed_change_rate: number
  trade_volume: number
  acc_trade_price: number
  acc_trade_price_24h: number
  acc_trade_volume: number
  acc_trade_volume_24h: number
  highest_52_week_price: number
  highest_52_week_date: string
  lowest_52_week_price: number
  lowest_52_week_date: string
  timestamp: number
}

export interface IMyTradeData {
  positions: Array<TradePosition>
  orders: Array<TradeOrder>
}

export interface IUpbitCandle {
  market: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  timestamp: number
  candle_acc_trade_price: number
  candle_acc_trade_volume: number
  unit: number
}
