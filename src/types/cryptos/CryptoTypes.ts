export const WalletTransactionType = {
  SYSTEM: 0,
  DEPOSIT: 1,
  WITHDRAW: 2,
  TRADE: 3,
} as const
export type WalletTransactionTypeValues = (typeof WalletTransactionType)[keyof typeof WalletTransactionType]
export const WalletTransactionTypeNames = {
  0: '시스템',
  1: '입금',
  2: '출금',
  3: '거래',
}

export const TransferTypes = {
  TO_WALLET: 0,
  TO_ACCOUNT: 1,
} as const
export type TransferTypeValues = (typeof TransferTypes)[keyof typeof TransferTypes]

export const MarginModeType = {
  ISOLATED: 0,
  CROSSED: 1,
} as const
export type MarginModeTypeValues = (typeof MarginModeType)[keyof typeof MarginModeType]
export const MarginModeTypeNames = {
  0: '격리',
  1: '교차',
}

export const PositionType = {
  LONG: 0,
  SHORT: 1,
} as const
export type PositionTypeValues = (typeof PositionType)[keyof typeof PositionType]

export const TradeType = {
  OPEN: 0,
  CLOSE: 1,
  LIQ: 2,
} as const
export type TradeTypeValues = (typeof TradeType)[keyof typeof TradeType]

export const TradeStatus = {
  WAIT: 0,
  DONE: 1,
  FAIL: 2,
}
export type TradeStatusKeys = (typeof TradeStatus)[keyof typeof TradeStatus]

export const TradeOrderType = {
  NONE: 0,
  LIMIT: 1,
  MARKET: 2,
  TAKE_PROFIT: 3,
  STOP_LOSS: 4,
  LIQUIDATE: 5,
} as const
export type TradeOrderTypeValues = (typeof TradeOrderType)[keyof typeof TradeOrderType]
export const TradeOrderTypeNames = {
  0: '-',
  1: '지정가',
  2: '시장가',
  3: '청산',
}

export const MarketTypes = {
  KRW: 'KRW',
  BTC: 'BTC',
  USDT: 'USDT',
  HOLD: 'HOLD',
} as const
export type MarketTypeValues = (typeof MarketTypes)[keyof typeof MarketTypes]
export const MarketTypeNames = {
  KRW: 'KRW',
  BTC: 'BTC',
  USDT: 'USDT',
  HOLD: '보유',
}

export const PriceChangeTypes = {
  EVEN: 'EVEN',
  RISE: 'RISE',
  FALL: 'FALL',
} as const
export type PriceChangeTypeValues = (typeof PriceChangeTypes)[keyof typeof PriceChangeTypes]

export const MarketSortTypes = {
  NAME: 'korean_name',
  PRICE: 'price',
  CHANGE: 'change_rate',
  TRADE_PRICE: 'trade_price',
} as const
export type MarketSortTypeValues = (typeof MarketSortTypes)[keyof typeof MarketSortTypes]
export const MarketSortTypeNames = {
  korean_name: '이름',
  price: '가격',
  change_rate: '전일대비',
  trade_price: '거래대금',
}

export const SizeUnitTypes = {
  PRICE: 0,
  QUANTITY: 1,
} as const
export type SizeUnitTypeValues = (typeof SizeUnitTypes)[keyof typeof SizeUnitTypes]

export type CandleMinuteUnits = 1 | 3 | 5 | 15 | 30 | 60 | 240
