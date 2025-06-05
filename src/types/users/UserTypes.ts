export const UserTypes = {
  NONE: -1,
  STAFF: 0,
  BRAND: 1,
  GENERAL: 2,
} as const;
export type UserType = (typeof UserTypes)[keyof typeof UserTypes];
export const UserTypeNames = {
  '-1': '-',
  0: '스태프',
  1: '기업회원',
  2: '일반회원',
};

export const AccountStatusTypes = {
  TEMP: 0,
  NORMAL: 1,
  BLOCK: 2,
} as const;
export type AccountStatusType = (typeof AccountStatusTypes)[keyof typeof AccountStatusTypes];

export const StaffTypes = {
  ADMIN: 0,
  STAFF: 1,
} as const;
export type StaffType = (typeof StaffTypes)[keyof typeof StaffTypes];

export const UserGenderTypes = {
  MALE: 0,
  FEMALE: 1,
  NONE: 2,
} as const;
export type UserGenderType = (typeof UserGenderTypes)[keyof typeof UserGenderTypes];
export const UserGenderNames = {
  0: '남성',
  1: '여성',
  2: '-',
};

export interface Token {
  access?: string;
  refresh?: string;
}
export interface LoginResponse {
  user: object;
  token: Token;
}
