import { AbsApiObject } from '../ApiTypes';
import User from '../users/User';

export default class MineRoom extends AbsApiObject {
  /** 방 고유 아이디 (NanoId) */
  protected _id: string;

  private _user: User;
  private _isCompleted: boolean;
  private _playTime: number;
  private _reward: number;
  private _seed: string;
  private _createdDate: string;

  constructor() {
    super();

    this._id = '';
    this._user = new User();
    this._isCompleted = false;
    this._playTime = 0;
    this._reward = 0;
    this._seed = '';
    this._createdDate = '';
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._user = new User();
    this._user.parseResponse(json.user);
    this._isCompleted = json.is_completed;
    this._playTime = json.play_time;
    this._reward = json.reward;
    this._seed = json.seed;
    this._createdDate = json.created_date;
  }

  /** 방 고유 아이디 (NanoId) */
  public get id(): string {
    return this._id;
  }

  public get user(): User {
    return this._user;
  }

  public get isCompleted(): boolean {
    return this._isCompleted;
  }

  public get playTime(): number {
    return this._playTime;
  }

  public get reward(): number {
    return this._reward;
  }

  public get seed(): string {
    return this._seed;
  }

  public get createdDate(): string {
    return this._createdDate;
  }
}
