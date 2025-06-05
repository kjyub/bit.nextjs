export const WalletTransactionTypes = {
  SYSTEM: 0,
  DEPOSIT: 1,
  WITHDRAW: 2,
  TRADE: 3,
} as const;
export type WalletTransactionType = (typeof WalletTransactionTypes)[keyof typeof WalletTransactionTypes];
export const WalletTransactionTypeNames = {
  0: '시스템',
  1: '입금',
  2: '출금',
  3: '거래',
};

export const TransferTypes = {
  TO_WALLET: 0,
  TO_ACCOUNT: 1,
} as const;
export type TransferType = (typeof TransferTypes)[keyof typeof TransferTypes];

export const MarginModeTypes = {
  ISOLATED: 0,
  CROSSED: 1,
} as const;
export type MarginModeType = (typeof MarginModeTypes)[keyof typeof MarginModeTypes];
export const MarginModeTypeNames = {
  0: '격리',
  1: '교차',
};

export const PositionTypes = {
  LONG: 0,
  SHORT: 1,
} as const;
export type PositionType = (typeof PositionTypes)[keyof typeof PositionTypes];

export const TradeTypes = {
  OPEN: 0,
  CLOSE: 1,
  LIQ: 2,
} as const;
export type TradeType = (typeof TradeTypes)[keyof typeof TradeTypes];

export const TradeStatus = {
  WAIT: 0,
  DONE: 1,
  FAIL: 2,
};
export type TradeStatusKeys = (typeof TradeStatus)[keyof typeof TradeStatus];

export const TradeOrderTypes = {
  NONE: 0,
  LIMIT: 1,
  MARKET: 2,
  TAKE_PROFIT: 3,
  STOP_LOSS: 4,
  LIQUIDATE: 5,
} as const;
export type TradeOrderType = (typeof TradeOrderTypes)[keyof typeof TradeOrderTypes];
export const TradeOrderTypeNames = {
  0: '-',
  1: '지정가',
  2: '시장가',
  3: 'TP',
  4: 'SL',
  5: '청산',
};

export const MarketTypes = {
  KRW: 'KRW',
  BTC: 'BTC',
  USDT: 'USDT',
  HOLD: 'HOLD',
} as const;
export type MarketType = (typeof MarketTypes)[keyof typeof MarketTypes];
export const MarketTypeNames = {
  KRW: 'KRW',
  BTC: 'BTC',
  USDT: 'USDT',
  HOLD: '보유',
};

export const PriceChangeTypes = {
  EVEN: 'EVEN',
  RISE: 'RISE',
  FALL: 'FALL',
} as const;
export type PriceChangeType = (typeof PriceChangeTypes)[keyof typeof PriceChangeTypes];

export const MarketSortTypes = {
  NAME: 'korean_name',
  PRICE: 'price',
  CHANGE: 'change_rate',
  TRADE_PRICE: 'trade_price',
} as const;
export type MarketSortType = (typeof MarketSortTypes)[keyof typeof MarketSortTypes];
export const MarketSortTypeNames = {
  korean_name: '이름',
  price: '가격',
  change_rate: '전일대비',
  trade_price: '거래대금',
};

export const SizeUnitTypes = {
  PRICE: 0,
  QUANTITY: 1,
} as const;
export type SizeUnitType = (typeof SizeUnitTypes)[keyof typeof SizeUnitTypes];

export type CandleMinuteUnits = 1 | 3 | 5 | 10 | 15 | 30 | 60 | 240;
