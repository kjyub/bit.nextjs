import { AbsApiObject } from '../ApiTypes';

export default class HammerGame extends AbsApiObject {
  /** 방 고유 아이디 (NanoId) */
  protected _id: string;

  private _highScore: number;
  private _averageScore: number;

  constructor() {
    super();

    this._id = '';
    this._highScore = 0;
    this._averageScore = 0;
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._highScore = json.high_score;
    this._averageScore = json.average_score;
  }

  /** 방 고유 아이디 (NanoId) */
  public get id(): string {
    return this._id;
  }

  public get highScore(): number {
    return this._highScore;
  }

  public get averageScore(): number {
    return this._averageScore;
  }
}
