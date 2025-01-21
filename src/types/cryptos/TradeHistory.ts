import React from "react"
import CommonUtils from "@/utils/CommonUtils"
import { AbsApiObject } from "../ApiTypes"
import { MarginModeType, MarginModeTypeValues, PositionType, PositionTypeValues, TradeOrderType, TradeOrderTypeValues } from "./CryptoTypes"
import CryptoMarket from "./CryptoMarket"
import TradeOrder from "./TradeOrder"

export default class TradeHistory extends AbsApiObject {
    private _id: number
    
    private _order: TradeOrder
    private _orderType: TradeOrderTypeValues
    private _positionType: PositionTypeValues
    private _price: number
    private _quantity: number
    private _leverage: number
    private _fee: number
    private _pnl: number

    private _createdDate: string

    constructor() {
        super()
        this._id = -1
        this._order = new TradeOrder()
        this._orderType = TradeOrderType.NONE
        this._positionType = PositionType.LONG
        this._price = 0
        this._quantity = 0
        this._leverage = 0
        this._fee = 0
        this._pnl = 0
        this._createdDate = ""
    }

    parseResponse(json: object): void {
        if (!super.isValidParseResponse(json)) return
        // ApiUtils.parseData(this, json)
        
        this._id = json["id"]
        this._order.parseResponse(json["order"] as object)
        this._orderType = json["order_type"]
        this._positionType = json["position_type"]
        this._price = json["price"]
        this._quantity = json["quantity"]
        this._leverage = json["leverage"]
        this._fee = json["fee"]
        this._pnl = json["pnl"]

        this._createdDate = json["created_date"]
    }

    public get id(): number {
        return this._id
    }
    public get order(): TradeOrder {
        return this._order
    }
    public get orderType(): TradeOrderTypeValues {
        return this._orderType
    }
    public get positionType(): PositionTypeValues {
        return this._positionType
    }
    public get price(): number {
        return this._price
    }
    public get quantity(): number {
        return this._quantity
    }
    public get leverage(): number {
        return this._leverage
    }
    public get fee(): number {
        return this._fee
    }
    public get pnl(): number {
        return this._pnl
    }

    public get createdDate(): string { 
        return this._createdDate
    }
}