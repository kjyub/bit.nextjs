import React from "react"
import CommonUtils from "@/utils/CommonUtils"
import { AbsApiObject } from "../ApiTypes"
import { MarginModeType, OrderType, PositionType, TradeType } from "./CryptoTypes"

export default class TradeOrder extends AbsApiObject {
    private _id: number
    
    private _marketCode: string
    private _isOpen: boolean
    private _marginMode: MarginModeType
    private _orderType: OrderType
    private _positionType: PositionType
    private _tradeType: TradeType
    private _tradeTime: string
    private _entryPrice: number
    private _quantity: number
    private _leverage: number
    private _fee: number
    private _totalPrice: number
    private _closeTime: string
    private _isOpen: boolean
    private _isCancel: boolean
    private _pnl: number

    constructor() {
        super()
        this._id = -1
        this._marketCode = ""
        this._isOpen = false
        this._marginMode = MarginModeType.CROSSED
        this._orderType = OrderType.LIMIT
        this._positionType = PositionType.LONG
        this._tradeType = TradeType.OPEN
        this._tradeTime = ""
        this._entryPrice = 0
        this._quantity = 0
        this._leverage = 1
        this._fee = 0
        this._totalPrice = 0
        this._closeTime = ""
        this._isOpen = false
        this._isCancel = false
        this._pnl = 0
    }

    parseResponse(json: object): void {
        if (!super.isValidParseResponse(json)) return
        // ApiUtils.parseData(this, json)
        
        this._id = json["id"]
        this._marketCode = json["market_code"]
        this._isOpen = json["is_open"]
        this._marginMode = json["margin_mode"]
        this._orderType = json["order_type"]
        this._positionType = json["position_type"]
        this._tradeType = json["trade_type"]
        this._tradeTime = json["trade_time"]
        this._entryPrice = json["entry_price"]
        this._quantity = json["quantity"]
        this._leverage = json["leverage"]
        this._fee = json["fee"]
        this._totalPrice = json["total_price"]
        this._closeTime = json["close_time"]
        this._isOpen = json["is_open"]
        this._isCancel = json["is_cancel"]
        this._pnl = json["pnl"]
    }

    public get id(): number {
        return this._id
    }
    public get marketCode(): string {
        return this._marketCode
    }
    public get isOpen(): boolean {
        return this._isOpen
    }
    public get marginMode(): MarginModeType {
        return this._marginMode
    }
    public get orderType(): OrderType {
        return this._orderType
    }
    public get positionType(): PositionType {
        return this._positionType
    }
    public get tradeType(): TradeType {
        return this._tradeType
    }
    public get tradeTime(): string {
        return this._tradeTime
    }
    public get entryPrice(): number {
        return this._entryPrice
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
    public get totalPrice(): number {
        return this._totalPrice
    }
    public get closeTime(): string {
        return this._closeTime
    }
    public get isOpen(): boolean {
        return this._isOpen
    }
    public get isCancel(): boolean {
        return this._isCancel
    }
    public get pnl(): number {
        return this._pnl
    }
}