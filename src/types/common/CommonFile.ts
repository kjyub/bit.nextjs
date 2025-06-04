import { AbsApiObject } from '../ApiTypes';
import User from '../users/User';

export default class extends AbsApiObject {
  protected _id: number;
  private _nanoId: string;
  private _user: User;
  private _name: string;
  private _size: number;
  private _fileUrl: string;

  constructor() {
    super();
    this._id = -1;
    this._nanoId = '';
    this._user = new User();
    this._name = '';
    this._size = 0;
    this._fileUrl = '';
  }

  parseResponse(json) {
    if (!super.isValidParseResponse(json)) return;

    this._id = json.id;
    this._nanoId = json.nano_id;
    this._user = new User();
    this._user.parseResponse(json.user);
    this._name = json.name;
    this._size = json.size;
    this._fileUrl = json.file;
  }

  public get id(): number {
    return this._id;
  }
  public get nanoId(): string {
    return this._nanoId;
  }
  public get user(): User {
    return this._user;
  }
  public get name(): string {
    return this._name;
  }
  public get size(): number {
    return this._size;
  }
  public get fileUrl(): string {
    return this._fileUrl;
  }
}
