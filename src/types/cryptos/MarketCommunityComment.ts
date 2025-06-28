import User from '@/types/users/User';
import { AbsApiObject } from '../ApiTypes';

export default class MarketCommunityComment extends AbsApiObject {
  protected _id: number;
  private _communityNanoId: string;
  private _parentId: number;

  private _user: User;
  private _content: string;
  private _likes: number;
  private _dislikes: number;
  private _createdDate: string;
  private _updatedDate: string;

  constructor() {
    super();
    this._id = 0;
    this._communityNanoId = '';
    this._parentId = 0;
    this._user = new User();
    this._content = '';
    this._likes = 0;
    this._dislikes = 0;
    this._createdDate = '';
    this._updatedDate = '';
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._communityNanoId = json.community_nano_id;
    this._parentId = json.parent_id;
    this._user = new User();
    this._user.parseResponse(json.user);
    this._content = json.content;
    this._likes = json.likes;
    this._dislikes = json.dislikes;
    this._createdDate = json.created_date;
    this._updatedDate = json.updated_date;
  }

  public get id(): number {
    return this._id;
  }
  public get communityNanoId(): string {
    return this._communityNanoId;
  }
  public get parentId(): number {
    return this._parentId;
  }
  public get user(): User {
    return this._user;
  }
  public get content(): string {
    return this._content;
  }
  public get likes(): number {
    return this._likes;
  }
  public get dislikes(): number {
    return this._dislikes;
  }
  public get createdDate(): string {
    return this._createdDate;
  }
  public get updatedDate(): string {
    return this._updatedDate;
  }
}
