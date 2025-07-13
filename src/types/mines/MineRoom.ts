import { AbsApiObject } from '../ApiTypes';
import User from '../users/User';
import HammerGame from './HammerGame';
import MazeGame from './MazeGame';
import { GameTypes, type GameType } from './MineTypes';

export default class MineRoom extends AbsApiObject {
  /** 방 고유 아이디 (NanoId) */
  protected _id: string;

  private _user: User;
  private _nickname: string;
  private _isCompleted: boolean;
  private _playTime: number;
  private _reward: number;
  private _gameType: GameType;
  private _isPractice: boolean;
  private _createdDate: string;
  private _updatedDate: string;

  private _mazeGame: MazeGame;
  private _hammerGame: HammerGame;

  constructor() {
    super();

    this._id = '';
    this._user = new User();
    this._nickname = '';
    this._isCompleted = false;
    this._playTime = 0;
    this._reward = 0;
    this._gameType = GameTypes.NONE;
    this._isPractice = false;
    this._createdDate = '';
    this._updatedDate = '';

    this._mazeGame = new MazeGame();
    this._hammerGame = new HammerGame();
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._user = new User();
    this._user.parseResponse(json.user);
    this._nickname = json.nickname;
    this._isCompleted = json.is_completed;
    this._playTime = json.play_time;
    this._reward = json.reward;
    this._gameType = json.game_type;
    this._isPractice = json.is_practice;
    this._createdDate = json.created_date;
    this._updatedDate = json.updated_date;

    this._mazeGame = new MazeGame();
    this._mazeGame.parseResponse(json.maze_game);
    this._hammerGame = new HammerGame();
    this._hammerGame.parseResponse(json.hammer_game);
  }

  /** 방 고유 아이디 (NanoId) */
  public get id(): string {
    return this._id;
  }

  public get user(): User {
    return this._user;
  }

  public get nickname(): string {
    return this._nickname;
  }

  public get userName(): string {
    if (this._user.id) return this._user.nickname;
    return this._nickname;
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

  public get gameType(): GameType {
    return this._gameType;
  }

  public get isPractice(): boolean {
    return this._isPractice;
  }

  public get createdDate(): string {
    return this._createdDate;
  }

  public get updatedDate(): string {
    return this._updatedDate;
  }

  public get mazeGame(): MazeGame {
    return this._mazeGame;
  }

  public get hammerGame(): HammerGame {
    return this._hammerGame;
  }
}
