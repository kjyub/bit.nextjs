import React from "react"
import CommonUtils from "@/utils/CommonUtils"
import { AbsApiObject } from "../ApiTypes"
import { PriceChangeTypes } from "./CryptoTypes"
import CryptoUtils from "@/utils/CryptoUtils"

export default class CryptoWallet extends AbsApiObject {
    private _balance: number

    constructor() {
        super()
        this._balance = 0
    }

    parseResponse(json: object): void {
        if (!super.isValidParseResponse(json)) return
        // ApiUtils.parseData(this, json)
        
        this._balance = Number(json["balance"] ?? "0")
    }

    public get balance(): number {
        return this._balance
    }
}