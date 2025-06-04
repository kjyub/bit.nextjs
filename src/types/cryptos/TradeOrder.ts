import { AbsApiObject } from '../ApiTypes';
import CryptoMarket from './CryptoMarket';
import {
  MarginModeType,
  type MarginModeTypeValues,
  PositionType,
  TradeOrderType,
  type TradeOrderTypeValues,
  TradeType,
  type TradeTypeValues,
} from './CryptoTypes';

export default class TradeOrder extends AbsApiObject {
  private _id: number;

  private _marketCode: string;
  private _market: CryptoMarket;
  private _isOpen: boolean;
  private _marginMode: MarginModeTypeValues;
  private _orderType: TradeOrderTypeValues;
  private _positionType: PositionType;
  private _tradeType: TradeTypeValues;
  private _tradeTime: string;
  private _entryPrice: number;
  private _quantity: number;
  private _leverage: number;
  private _fee: number;
  private _size: number;
  private _cost: number;
  private _totalCost: number;
  private _closeTime: string;
  private _isOpen: boolean;
  private _isCancel: boolean;

  private _createdDate: string;

  constructor() {
    super();
    this._id = -1;
    this._marketCode = '';
    this._market = new CryptoMarket();
    this._isOpen = false;
    this._marginMode = MarginModeType.CROSSED;
    this._orderType = TradeOrderType.LIMIT;
    this._positionType = PositionType.LONG;
    this._tradeType = TradeType.OPEN;
    this._tradeTime = '';
    this._entryPrice = 0;
    this._quantity = 0;
    this._leverage = 1;
    this._fee = 0;
    this._size = 0;
    this._cost = 0;
    this._totalCost = 0;
    this._closeTime = '';
    this._isOpen = false;
    this._isCancel = false;

    this._createdDate = '';
  }

  parseResponse(json: object): void {
    if (!super.isValidParseResponse(json)) return;
    // ApiUtils.parseData(this, json)

    this._id = json.id;
    this._marketCode = json.market_code;
    this._market.parseResponse(json.market as object);
    this._isOpen = json.is_open;
    this._marginMode = json.margin_mode;
    this._orderType = json.order_type;
    this._positionType = json.position_type;
    this._tradeType = json.trade_type;
    this._tradeTime = json.trade_time;
    this._entryPrice = json.entry_price;
    this._quantity = json.quantity;
    this._leverage = json.leverage;
    this._fee = json.fee;
    this._size = json.size;
    this._cost = json.cost;
    this._totalCost = json.total_cost;
    this._closeTime = json.close_time;
    this._isOpen = json.is_open;
    this._isCancel = json.is_cancel;

    this._createdDate = json.created_date;
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
  public get orderType(): TradeOrderTypeValues {
    return this._orderType;
  }
  public get positionType(): PositionType {
    return this._positionType;
  }
  public get tradeType(): TradeTypeValues {
    return this._tradeType;
  }
  public get tradeTime(): string {
    return this._tradeTime;
  }
  public get entryPrice(): number {
    return this._entryPrice;
  }
  public get quantity(): number {
    return this._quantity;
  }
  public get leverage(): number {
    return this._leverage;
  }
  public get fee(): number {
    return this._fee;
  }
  public get size(): number {
    return this._size;
  }
  public get cost(): number {
    return this._cost;
  }
  public get totalCost(): number {
    return this._totalCost;
  }
  public get closeTime(): string {
    return this._closeTime;
  }
  public get isOpen(): boolean {
    return this._isOpen;
  }
  public get isCancel(): boolean {
    return this._isCancel;
  }
  public get createdDate(): string {
    return this._createdDate;
  }
}
