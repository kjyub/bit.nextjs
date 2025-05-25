import { AbsApiObject } from '../ApiTypes';

export default class Sigungu extends AbsApiObject {
  private _id: number;
  private _index: number;
  private _sido: string;
  private _sidoEnglish: string;
  private _sidoShort: string;
  private _sigungu: string;
  private _sigunguEnglish: string;

  constructor() {
    super();
    this._id = -1;
    this._index = -1;
    this._sido = '';
    this._sidoEnglish = '';
    this._sidoShort = '';
    this._sigungu = '';
    this._sigunguEnglish = '';
  }

  parseResponse(json) {
    if (!super.isValidParseResponse(json)) return;

    this._id = json['id'];
    this._index = json['index'];
    this._sido = json['sido'];
    this._sidoEnglish = json['sido_english'];
    this._sidoShort = json['sido_short'];
    this._sigungu = json['sigungu'];
    this._sigunguEnglish = json['sigungu_english'];
  }

  title(): string {
    if (!this.sigungu) {
      return this.sido;
    }
    return `${this.sido} ${this.sigungu}`;
  }

  subtitle(): string {
    if (!this.sigungu) {
      return this.sido;
    }
    return this.sigungu;
  }

  public get id(): number {
    return this._id;
  }
  public get index(): number {
    return this._index;
  }
  public get sido(): string {
    return this._sido;
  }
  public get sidoEnglish(): string {
    return this._sidoEnglish;
  }
  public get sidoShort(): string {
    return this._sidoShort;
  }
  public get sigungu(): string {
    return this._sigungu;
  }
  public get sigunguEnglish(): string {
    return this._sigunguEnglish;
  }
}
