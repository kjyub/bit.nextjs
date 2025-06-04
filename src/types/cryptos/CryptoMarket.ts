import CryptoUtils from '@/utils/CryptoUtils';
import { AbsApiObject } from '../ApiTypes';
import type { PriceChangeTypeValues } from './CryptoTypes';

export default class CryptoMarket extends AbsApiObject {
  private _id: number;

  private _code: string;
  private _koreanName: string;
  private _englishName: string;
  private _price: number;
  private _openingPrice: number;
  private _isClosed: boolean;

  constructor() {
    super();
    this._id = -1;
    this._code = '';
    this._koreanName = '';
    this._englishName = '';
    this._price = 0;
    this._openingPrice = 0;
    this._isClosed = false;
  }

  parseResponse(json: object): void {
    if (!super.isValidParseResponse(json)) return;
    // ApiUtils.parseData(this, json)

    this._id = json.id;
    this._code = json.code;
    this._koreanName = json.korean_name;
    this._englishName = json.english_name;
    this._price = json.price;
    this._openingPrice = json.opening_price;
    this._isClosed = json.is_closed;
  }

  public get id(): number {
    return this._id;
  }
  public get code(): string {
    return this._code;
  }
  public get koreanName(): string {
    return this._koreanName;
  }
  public get englishName(): string {
    return this._englishName;
  }
  public get price(): number {
    return this._price;
  }
  public get openingPrice(): number {
    return this._openingPrice;
  }
  public get isClosed(): boolean {
    return this._isClosed;
  }
  public get change(): PriceChangeTypeValues {
    return CryptoUtils.getPriceChangeType(this._price, this._openingPrice);
  }
  public get changePrice(): number {
    return this._price - this._openingPrice;
  }
  public get changeRate(): number {
    if (this._openingPrice === 0) return 0;

    return ((this._price - this._openingPrice) / this._openingPrice) * 100;
  }

  public get unit(): string {
    if (!this._code.includes('-')) {
      return '';
    }

    return this._code.split('-')[1];
  }
}
