import React from "react"
import CommonUtils from "@/utils/CommonUtils"
import { AccountStatusTypes, UserTypes, UserTypeValues } from "@/types/users/UserTypes"
import { Expose } from "class-transformer"
import { AbsApiObject } from "../ApiTypes"
import UserBrand from "./UserBrand"
import ApiUtils from "@/utils/ApiUtils"
import UserGeneral from "./UserGeneral"

export default class User extends AbsApiObject {
    private _id: number
    
    private _uuid: string
    private _userType: UserTypeValues
    private _accountStatus: AccountStatusTypes
    private _email: string
    private _nickname: string
    private _profileImageUrl: string
    private _cash: number
    private _rep: number

    constructor() {
        super()
        this._id = -1
        this._uuid = ""
        this._userType = UserTypes.NONE
        this._accountStatus = AccountStatusTypes.TEMP
        this._email = ""
        this._nickname = ""
        this._profileImageUrl = ""
        this._cash = 0
        this._rep = 0
    }

    parseResponse(json: object): void {
        if (!super.isValidParseResponse(json)) return
        // ApiUtils.parseData(this, json)
        
        this._id = json["id"]
        this._uuid = json["uuid"]
        this._userType = json["user_type"]
        this._accountStatus = json["account_status"]
        this._email = json["email"]
        this._nickname = json["nickname"]
        this._profileImageUrl = json["profile_image_url"]
        this._cash = json["cash"]
        this._rep = json["rep"]
    }

    public get id(): number {
        return this._id
    }
    public get uuid(): string {
        return this._uuid
    }
    public get userType(): UserTypeValues {
        return this._userType
    }
    public get accountStatus(): AccountStatusTypes {
        return this._accountStatus
    }
    public get email(): string {
        return this._email
    }
    public get nickname(): string {
        return this._nickname
    }
    public get profileImageUrl(): string {
        return this._profileImageUrl
    }
    public get cash(): number {
        return this._cash
    }
    public get rep(): number {
        return this._rep
    }
}