import CryptoUtils from '@/utils/CryptoUtils';
import { AbsApiObject } from '../ApiTypes';
import type { PriceChangeType } from './CryptoTypes';
import User from '../users/User';
import CryptoMarket from './CryptoMarket';
import TradePosition from './TradePosition';

export default class CryptoFlex extends AbsApiObject {
  protected _id: number;

  private _user: User;
  private _market: CryptoMarket;
  private _position: TradePosition;
  private _createdDate: string;

  constructor() {
    super();
    this._id = -1;
    this._user = new User();
    this._market = new CryptoMarket();
    this._position = new TradePosition();
    this._createdDate = '';
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._user = new User();
    this._user.parseResponse(json.user);
    this._market = new CryptoMarket();
    this._market.parseResponse(json.market);
    this._position = new TradePosition();
    this._position.parseResponse(json.position);
    this._createdDate = json.created_date;
  }

  public get id(): number {
    return this._id;
  }
  public get user(): User {
    return this._user;
  }
  public get market(): CryptoMarket {
    return this._market;
  }
  public get position(): TradePosition {
    return this._position;
  }
  public get createdDate(): string {
    return this._createdDate;
  }
}
