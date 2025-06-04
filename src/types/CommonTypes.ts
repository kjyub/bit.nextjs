export enum TextFormats {
  TEXT = 0,
  NUMBER = 1,
  NUMBER_ONLY = 2,
  PRICE = 3,
  TEL = 4,
  KOREAN_PRICE = 5,
  KOREAN_PRICE_SIMPLE = 6,
}

export type objectType = {
  [key: string | number]: any;
};

export interface IRawData {
  pageIndex: number;
  lastId: string;
  items: Array<object>;
  scrollLocation: number;
}
