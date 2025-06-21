import type { ChartColorType } from '@/store/providers/UiProvider';
import { type AccountStatusType, AccountStatusTypes, type UserType, UserTypes } from '@/types/users/UserTypes';
import { AbsApiObject } from '../ApiTypes';

export default class User extends AbsApiObject {
  protected _id: number;

  private _uuid: string;
  private _userType: UserType;
  private _accountStatus: AccountStatusType;
  private _email: string;
  private _nickname: string;
  private _profileImageUrl: string;
  private _cash: number;
  private _rep: number;
  private _chartColor: ChartColorType;

  constructor() {
    super();
    this._id = -1;
    this._uuid = '';
    this._userType = UserTypes.NONE;
    this._accountStatus = AccountStatusTypes.TEMP;
    this._email = '';
    this._nickname = '';
    this._profileImageUrl = '';
    this._cash = 0;
    this._rep = 0;
    this._chartColor = 'red-blue';
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._uuid = json.uuid;
    this._userType = json.user_type;
    this._accountStatus = json.account_status;
    this._email = json.email;
    this._nickname = json.nickname;
    this._profileImageUrl = json.profile_image_url;
    this._cash = json.cash;
    this._rep = json.rep;
    this._chartColor = json.chart_color;
  }

  public get id(): number {
    if (typeof this._id === 'string') {
      return Number.parseInt(this._id);
    }

    return this._id;
  }
  public get uuid(): string {
    return this._uuid;
  }
  public get userType(): UserType {
    return this._userType;
  }
  public get accountStatus(): AccountStatusType {
    return this._accountStatus;
  }
  public get email(): string {
    return this._email;
  }
  public get nickname(): string {
    return this._nickname;
  }
  public get profileImageUrl(): string {
    return this._profileImageUrl;
  }
  public get cash(): number {
    return this._cash;
  }
  public get rep(): number {
    return this._rep;
  }
  public get chartColor(): ChartColorType {
    return this._chartColor;
  }
}
