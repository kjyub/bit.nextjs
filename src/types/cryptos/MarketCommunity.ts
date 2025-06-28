import User from '@/types/users/User';
import { AbsApiObject } from '../ApiTypes';
import { type LikeType, LikeTypes } from '../common/CommonTypes';

export default class MarketCommunity extends AbsApiObject {
  protected _id: number;
  private _nanoId: string;

  private _marketCode: string;
  private _user: User;
  private _title: string;
  private _content: string;
  private _views: number;
  private _likes: number;
  private _likeType: LikeType;
  private _dislikes: number;
  private _comments: number;
  private _createdDate: string;
  private _updatedDate: string;

  constructor() {
    super();
    this._id = 0;
    this._nanoId = '';
    this._marketCode = '';
    this._user = new User();
    this._title = '';
    this._content = '';
    this._views = 0;
    this._likes = 0;
    this._dislikes = 0;
    this._likeType = LikeTypes.NONE;
    this._comments = 0;
    this._createdDate = '';
    this._updatedDate = '';
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._nanoId = json.nano_id;
    this._marketCode = json.market_code;
    this._user = new User();
    this._user.parseResponse(json.user);
    this._title = json.title;
    this._content = json.content;
    this._views = json.views;
    this._likes = json.likes;
    this._dislikes = json.dislikes;
    this._likeType = json.like_type ?? LikeTypes.NONE;
    this._comments = json.comment_count ?? 0;
    this._createdDate = json.created_date;
    this._updatedDate = json.updated_date;
  }

  public get id(): number {
    return this._id;
  }
  public get nanoId(): string {
    return this._nanoId;
  }
  public get marketCode(): string {
    return this._marketCode;
  }
  public get user(): User {
    return this._user;
  }
  public get title(): string {
    return this._title;
  }
  public get content(): string {
    return this._content;
  }
  public get views(): number {
    return this._views;
  }
  public get likes(): number {
    return this._likes;
  }
  public get dislikes(): number {
    return this._dislikes;
  }
  public get likeType(): LikeType {
    return this._likeType;
  }
  public get comments(): number {
    return this._comments;
  }
  public get createdDate(): string {
    return this._createdDate;
  }
  public get updatedDate(): string {
    return this._updatedDate;
  }
}
