import { AbsApiObject } from '../ApiTypes';

export default class CryptoWallet extends AbsApiObject {
  private _balance: number;
  private _locked: number;

  constructor() {
    super();
    this._balance = 0;
    this._locked = 0;
  }

  parseResponse(json: object): void {
    if (!super.isValidParseResponse(json)) return;
    // ApiUtils.parseData(this, json)

    this._balance = Number(json['balance'] ?? '0');
    this._locked = Number(json['locked'] ?? '0');
  }

  public get balance(): number {
    return this._balance;
  }
  public get locked(): number {
    return this._locked;
  }
}
