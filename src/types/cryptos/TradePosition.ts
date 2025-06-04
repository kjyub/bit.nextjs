import { AbsApiObject } from '../ApiTypes';
import CryptoMarket from './CryptoMarket';
import { MarginModeType, type MarginModeTypeValues, PositionType } from './CryptoTypes';

export default class TradePosition extends AbsApiObject {
  private _id: number;

  private _marketCode: string;
  private _market: CryptoMarket;
  private _isOpen: boolean;
  private _marginMode: MarginModeTypeValues;
  private _positionType: PositionType;
  private _entryTime: string;
  private _averagePrice: number;
  private _quantity: number;
  private _marginPrice: number;
  private _averageLeverage: number;
  private _liquidatePrice: number;
  private _totalFee: number;
  private _entryPrice: number;
  private _averageClosePrice: number;
  private _pnl: number;
  private _closeTime: string;

  constructor() {
    super();
    this._id = -1;
    this._marketCode = '';
    this._market = new CryptoMarket();
    this._isOpen = false;
    this._marginMode = MarginModeType.CROSSED;
    this._positionType = PositionType.LONG;
    this._entryTime = '';
    this._averagePrice = 0;
    this._quantity = 0;
    this._marginPrice = 0;
    this._averageLeverage = 1;
    this._liquidatePrice = 0;
    this._totalFee = 0;
    this._entryPrice = '';
    this._averageClosePrice = 0;
    this._pnl = 0;
    this._closeTime = '';
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;
    // ApiUtils.parseData(this, json)

    this._id = json.id;
    this._marketCode = json.market_code;
    this._market.parseResponse(json.market as any);
    this._isOpen = json.is_open;
    this._marginMode = json.margin_mode;
    this._positionType = json.position_type;
    this._entryTime = json.entry_time;
    this._averagePrice = json.average_price;
    this._quantity = json.quantity;
    this._marginPrice = json.margin_price;
    this._averageLeverage = json.average_leverage;
    this._liquidatePrice = json.liquidate_price;
    this._totalFee = json.total_fee;
    this._entryPrice = json.entry_price;
    this._averageClosePrice = json.average_close_price;
    this._pnl = json.pnl;
    this._closeTime = json.close_time;
  }

  public get id(): number {
    return this._id;
  }
  public get marketCode(): string {
    return this._marketCode;
  }
  public get market(): CryptoMarket {
    return this._market;
  }
  public get isOpen(): boolean {
    return this._isOpen;
  }
  public get marginMode(): MarginModeTypeValues {
    return this._marginMode;
  }
  public get positionType(): PositionType {
    return this._positionType;
  }
  public get entryTime(): string {
    return this._entryTime;
  }
  public get averagePrice(): number {
    const price = Number(this._averagePrice);
    return Number.isNaN(price) ? 0 : price;
  }
  public get quantity(): number {
    const quantity = Number(this._quantity);
    return Number.isNaN(quantity) ? 0 : quantity;
  }
  public get marginPrice(): number {
    const price = Number(this._marginPrice);
    return Number.isNaN(price) ? 0 : price;
  }
  public get averageLeverage(): number {
    const leverage = Number(this._averageLeverage);
    return Number.isNaN(leverage) ? 1 : leverage;
  }
  public get liquidatePrice(): number {
    return this._liquidatePrice;
  }
  public get totalFee(): number {
    return this._totalFee;
  }
  public get entryPrice(): number {
    return this._entryPrice;
  }
  public get averageClosePrice(): number {
    return this._averageClosePrice;
  }
  public get pnl(): number {
    return this._pnl;
  }
  public get closeTime(): string {
    return this._closeTime;
  }
}
