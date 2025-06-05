export const CommonTypes = {
  NONE: -1,
  STAFF: 0,
  BRAND: 1,
  COMMON: 2,
};
export const OrderTypes = {
  ASC: 0,
  DESC: 1,
} as const;
export type OrderType = (typeof OrderTypes)[keyof typeof OrderTypes];
export const OrderTypeNames = {
  0: '오름차순',
  1: '내림차순',
};

export const LikeTypes = {
  LIKE: 1,
  DISLIKE: -1,
  NONE: 0,
} as const;
export type LikeType = (typeof LikeTypes)[keyof typeof LikeTypes];
