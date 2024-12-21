export const WalletTransactionType = {
    SYSTEM: 0,
    DEPOSIT: 1,
    WITHDRAW: 2,
    TRADE: 3,
}
export const WalletTransactionTypeNames = {
    0: "시스템",
    1: "입금",
    2: "출금",
    3: "거래",
}

export const TransferTypes = {
    TO_WALLET: 0,
    TO_ACCOUNT: 1,
}

export const MarginModeType = {
    ISOLATED: 0,
    CROSSED: 1
}

export const PositionType = {
    LONG: 0,
    SHORT: 1
}

export const TradeType = {
    BUY: 0,
    SELL: 1,
    LIQ: 2,
}

export const TradeStatus = {
    WAIT: 0,
    DONE: 1,
    FAIL: 2,
}

export const OrderType = {
    NONE: 0,
    LIMIT: 1,
    MARKET: 2,
}

export const MarketTypes = {
    KRW: "KRW",
    BTC: "BTC",
    USDT: "USDT",
    HOLD: "HOLD",
}
export const MarketTypeNames = {
    KRW: "KRW",
    BTC: "BTC",
    USDT: "USDT",
    HOLD: "보유",
}

export const PriceChangeTypes = {
    EVEN: "EVEN",
    RISE: "RISE",
    FALL: "FALL",
}

export const MarketSortTypes = {
    NAME: "korean_name",
    PRICE: "price",
    CHANGE: "change_rate",
    TRADE_PRICE: "trade_price",
}
export const MarketSortTypeNames = {
    "korean_name": "이름",
    "price": "가격",
    "change_rate": "전일대비",
    "trade_price": "거래대금",
}