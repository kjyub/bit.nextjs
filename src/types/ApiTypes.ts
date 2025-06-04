export const REQUEST_TYPE_INSERT = 'REQUEST_TYPE_INSERT';
export const REQUEST_TYPE_UPDATE = 'REQUEST_TYPE_UPDATE';
export const REQUEST_TYPE_DELETE = 'REQUEST_TYPE_DELETE';
export const REQUEST_TYPE_SELECT = 'REQUEST_TYPE_SELECT';
export const REQUEST_TYPE_INSERT_OR_UPDATE = 'REQUEST_TYPE_INSERT_OR_UPDATE';

export enum QueryTypes {
  Insert = 0,
  Select = 1,
  Update = 2,
  Delete = 3,
  InsertOrUpdate = 4,
}

export abstract class AbsApiObject {
  protected _id: string | number;

  constructor() {
    this._id = '';
  }

  isEmpty(): boolean {
    return !this._id;
  }
  isValidParseResponse(json: any): boolean {
    return json && Object.keys(json).length > 0;
  }
  parseResponse(json: any) {
    if (!json) {
      return;
    }
  }
  parseRequest(): any {}
  stringifyRequest(): any {}
}

export const CookieConsts = {
  GUEST_ID: 'guest_id',
  USER_ACCESS_TOKEN: 'USER_ACCESS_TOKEN',
  USER_REFRESH_TOKEN: 'USER_REFRESH_TOKEN',
};

export const LocalStorageConsts = {
  EMAIL_GENERAL_REMEMBER: 'email_general_remember',
  EMAIL_BRAND_REMEMBER: 'email_brand_remember',
  EMAIL_STAFF_REMEMBER: 'email_staff_remember',
  WORK_SPACE_ID_RECENT: 'work_space_id_recent',
};
export const SessionStorageConsts = {
  USER_DATA: 'user_data',
};

export type ApiParamsTypes = {
  params: {
    [key: string]: string;
  };
};
