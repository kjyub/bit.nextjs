export enum EditTypes {
  ADD,
  MODIFY,
  REMOVE,
}

export enum EditStateTypes {
  NONE = -1,
  WAIT = 0,
  DISABLED = 1,
  EDITED = 2,
  PENDING = 3,
  DONE = 4,
  FAILED = 5,
}

export interface Paging<T> {
  pageCount: number;
  datas: Array<T>;
}

export const PagingBlank = {
  pageCount: 1,
  datas: [],
};

export enum DataTypes {
  TEXT,
  IMAGE,
}
