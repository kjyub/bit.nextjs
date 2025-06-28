import { AbsApiObject } from '../ApiTypes';
import User from './User';

export default class UserMessage extends AbsApiObject {
  protected _id: number;

  private _user: User;
  private _message: string;
  private _link: string;
  private _isRead: boolean;
  private _createdDate: string;

  constructor() {
    super();

    this._id = 0;
    this._user = new User();
    this._message = '';
    this._link = '';
    this._isRead = false;
    this._createdDate = '';
  }

  parseResponse(json: any): void {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._user = new User();
    this._user.parseResponse(json.user);
    this._message = json.message;
    this._link = json.link;
    this._isRead = json.is_read;
    this._createdDate = json.created_date;
  }

  public get id(): number {
    return this._id;
  }

  public get user(): User {
    return this._user;
  }

  public get message(): string {
    return this._message;
  }

  public get link(): string {
    return this._link;
  }

  public get isRead(): boolean {
    return this._isRead;
  }

  public get createdDate(): string {
    return this._createdDate;
  }
}
