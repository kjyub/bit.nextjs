export enum TextFormats {
    TEXT,
    NUMBER,
    NUMBER_ONLY,
    PRICE,
    TEL,
    KOREAN_PRICE,
    KOREAN_PRICE_SIMPLE,
}

export type objectType = {
    [key: string | number]: any
}

export interface IRawData {
    pageIndex: number
    lastId: string
    items: Array<object>
    scrollLocation: number
}