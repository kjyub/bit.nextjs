import { AbsApiObject } from '../ApiTypes';

export default class MazeGame extends AbsApiObject {
  /** 방 고유 아이디 (NanoId) */
  protected _id: string;

  private _seed: string;

  constructor() {
    super();

    this._id = '';
    this._seed = '';
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._seed = json.seed;
  }

  /** 방 고유 아이디 (NanoId) */
  public get id(): string {
    return this._id;
  }

  public get seed(): string {
    return this._seed;
  }
}
