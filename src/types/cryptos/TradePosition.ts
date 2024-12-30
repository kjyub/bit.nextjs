import React from "react"
import CommonUtils from "@/utils/CommonUtils"
import { AbsApiObject } from "../ApiTypes"
import { MarginModeType, PositionType } from "./CryptoTypes"
import CryptoMarket from "./CryptoMarket"

export default class TradePosition extends AbsApiObject {
    private _id: number
    
    private _marketCode: string
    private _market: CryptoMarket
    private _isOpen: boolean
    private _marginMode: MarginModeType
    private _positionType: PositionType
    private _entryTime: string
    private _averagePrice: number
    private _quantity: number
    private _marginPrice: number
    private _averageLeverage: number
    private _liquidatePrice: number
    private _totalFee: number

    constructor() {
        super()
        this._id = -1
        this._marketCode = ""
        this._market = new CryptoMarket()
        this._isOpen = false
        this._marginMode = MarginModeType.CROSSED
        this._positionType = PositionType.LONG
        this._entryTime = ""
        this._averagePrice = 0
        this._quantity = 0
        this._marginPrice = 0
        this._averageLeverage = 1
        this._liquidatePrice = 0
        this._totalFee = 0
    }

    parseResponse(json: object): void {
        if (!super.isValidParseResponse(json)) return
        // ApiUtils.parseData(this, json)
        
        this._id = json["id"]
        this._marketCode = json["market_code"]
        this._market.parseResponse(json["market"])
        this._isOpen = json["is_open"]
        this._marginMode = json["margin_mode"]
        this._positionType = json["position_type"]
        this._entryTime = json["entry_time"]
        this._averagePrice = json["average_price"]
        this._quantity = json["quantity"]
        this._marginPrice = json["margin_price"]
        this._averageLeverage = json["average_leverage"]
        this._liquidatePrice = json["liquidate_price"]
        this._totalFee = json["total_fee"]
    }

    public get id(): number {
        return this._id
    }
    public get marketCode(): string {
        return this._marketCode
    }
    public get market(): CryptoMarket {
        return this._market
    }
    public get isOpen(): boolean {
        return this._isOpen
    }
    public get marginMode(): MarginModeType {
        return this._marginMode
    }
    public get positionType(): PositionType {
        return this._positionType
    }
    public get entryTime(): string {
        return this._entryTime
    }
    public get averagePrice(): number {
        const price = Number(this._averagePrice)
        return isNaN(price) ? 0 : price
    }
    public get quantity(): number {
        return this._quantity
    }
    public get marginPrice(): number {
        return this._marginPrice
    }
    public get averageLeverage(): number {
        const leverage = Number(this._averageLeverage)
        return isNaN(leverage) ? 1 : leverage
    }
    public get liquidatePrice(): number {
        return this._liquidatePrice
    }
    public get totalFee(): number {
        return this._totalFee
    }
}