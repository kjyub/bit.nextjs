"use client"

import * as S from "@/styles/CryptoMyTradeStyles"
import * as I from "@/components/inputs/TradeInputs"
import { MarginModeType, MarginModeTypeNames, OrderType, PositionType, PriceChangeTypes, SizeUnitTypes, TradeType } from "@/types/cryptos/CryptoTypes"
import { useCallback, useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import { TextFormats } from "@/types/CommonTypes"
import TypeUtils from "@/utils/TypeUtils"
import useUserInfoStore from "@/store/useUserInfo"
import CryptoApi from "@/apis/api/cryptos/CryptoApi"
import TradePosition from "@/types/cryptos/TradePosition"
import CryptoMarket from "@/types/cryptos/CryptoMarket"
import User from "@/types/users/User"
import CryptoUtils from "@/utils/CryptoUtils"
import useMarketPriceStore from "@/store/useMarketPriceStore"

interface ICryptoMyTradePosition {
    user: User
    market: CryptoMarket
}
export default function CryptoMyTradePosition({ user, market }: ICryptoMyTradePosition) {
    const { balance, updateInfo } = useUserInfoStore()
    
    const [positions, setPositions] = useState<Array<TradePosition>>([])

    useEffect(() => {
        if (!CommonUtils.isStringNullOrEmpty(user.uuid)) {
            getPositions()
        }    
    }, [user.uuid, market])

    const getPositions = useCallback(() => {
        CryptoApi.getTradePostions().then((response) => {
            setPositions(response)
        })
    }, [market.code])

    return (
        <S.PageLayout className="min-h-[48rem] h-fit p-2 space-y-2">
            {positions.map((position, index) => (
                <Position key={index} position={position} userBudget={balance} />
            ))}
        </S.PageLayout>
    )
}

interface IPosition {
    position: TradePosition
    userBudget: number
}
const Position = ({ position, userBudget }: IPosition) => {
    const socketData = useMarketPriceStore((state) => state.marketDic[position.market.code])
    const marketPrice = socketData ? socketData.trade_price : 0

    const [changeType, setChangeType] = useState<PriceChangeTypes>(position.market.change)

    const [bep, setBep] = useState<number>(0)
    const [size, setSize] = useState<number>(0)
    const [marginRatio, setMarginRatio] = useState<number>(0)
    const [pnl, setPnl] = useState<number>(0)
    const [pnlRatio, setPnlRatio] = useState<number>(0)

    const [closePrice, setClosePrice] = useState<number>(0)
    const [closeQuantity, setCloseQuantity] = useState<number>(position.quantity)

    useEffect(() => {
        setClosePrice(marketPrice)
        setCloseQuantity(position.quantity)
    }, [position])

    useEffect(() => {
        if (socketData === undefined) {
            return
        }
        
        const _size = position.quantity * marketPrice
        setSize(_size)

        const breakEvenPrice = position.totalFee / position.quantity
        setBep(position.averagePrice + (CryptoUtils.getPriceRound(breakEvenPrice) * (position.positionType === PositionType.LONG ? 1 : -1)))
        const _pnl = CryptoUtils.getPnl(marketPrice, position.quantity, position.averagePrice, position.positionType) - position.totalFee
        setPnl(_pnl)
        setPnlRatio(_pnl / position.marginPrice)
        if (_pnl < 0) {
            if (position.marginMode === MarginModeType.CROSSED) {
                const margin = position.marginPrice + userBudget
                setMarginRatio(Math.abs(_pnl) / margin)
            } else if (position.marginMode === MarginModeType.ISOLATED) {
                setMarginRatio(Math.abs(_pnl) / position.marginPrice)
            }
        }

        setChangeType(CryptoUtils.getPriceChangeType(socketData.trade_price, socketData.opening_price))
    }, [position, marketPrice])

    const orderClose = useCallback(async (_orderType: OrderType) => {
        const data = {
            market_code: position.market.code,
            trade_type: TradeType.CLOSE,
            margin_mode: position.marginMode,
            position_type: position.positionType === PositionType.LONG ? PositionType.SHORT : PositionType.LONG,
            cost: position.cost,
            price: Number(marketPrice),
            quantity: Number(closeQuantity),
            size: Number(closeQuantity) * Number(closePrice),
            leverage: position.averageLeverage,
            size_unit_type: SizeUnitTypes.QUANTITY,
        }
        console.log(position, data)
        
        let result = false
        if (_orderType === OrderType.LIMIT) {
            data["price"] = Number(closePrice)
            data["quantity"] = Number(closeQuantity)
            data["size"] = Number(closeQuantity) * Number(closePrice)

            result = await CryptoApi.orderLimit(data)
        } else if (_orderType === OrderType.MARKET) {
            data["price"] = marketPrice
            data["quantity"] = Number(closeQuantity)
            data["size"] = Number(closeQuantity) * marketPrice

            result = await CryptoApi.orderMarket(data)
        }

        if (result) {
            alert("거래가 성공적으로 완료되었습니다.")
            // updateInfo()
        } else {
            alert("거래에 실패하였습니다.")
        }
    }, [position, marketPrice, closePrice, closeQuantity])

    return (
        <S.PositionBox>
            <S.PositionHeader>
                <div className="left">
                    <div className={`position ${position.positionType === PositionType.LONG ? "long" : "short"}`}>
                        {position.positionType === PositionType.LONG ? "LONG" : "SHORT"}
                    </div>

                    <p className="title">
                        <span className="korean">
                            {position.market.koreanName}
                        </span>
                        <span className="english">
                            {position.market.englishName}
                        </span>
                        <span className="code">
                            {position.market.code}
                        </span>
                    </p>

                    <p className={`${changeType === PriceChangeTypes.RISE ? "rise" : changeType === PriceChangeTypes.FALL ? "fall" : ""} price`}>
                        {CryptoUtils.getPriceText(marketPrice)}{"KRW"}
                    </p>
                </div>

                <div className="right">
                    <button className="value">
                        TP/SL
                    </button>
                    <div className="value">
                        {CommonUtils.round(position.averageLeverage, 2)}x
                    </div>
                    <div className="value">
                        {MarginModeTypeNames[position.marginMode]}
                    </div>
                </div>
            </S.PositionHeader>

            <S.PositionBody>
                <S.PositionItem className={``}>
                    <dt>진입가격 <span>Entry Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.averagePrice)}</dd>
                </S.PositionItem>
                <S.PositionItem>
                    <dt>청산가격 <span>Liq.Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.liquidatePrice)}</dd>
                </S.PositionItem>
                <S.PositionItem>
                    <dt>손익분기점 <span>Break Even Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(bep)}</dd>
                </S.PositionItem>
                <S.PositionItem className={`[&>dd]:font-medium`}>
                    <dt>현재가격 <span>Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(marketPrice)}</dd>
                </S.PositionItem>

                <S.PositionItem className={`${position.positionType === PositionType.LONG ? "long" : "short"}`}>
                    <dt>포지션 크기 <span>Size</span></dt>
                    <dd className="flex flex-col w-full">
                        <span>
                            {position.positionType === PositionType.SHORT && "-"}{CryptoUtils.getPriceText(size)}{"TW"}
                        </span>
                        <span className="text-xs">
                            {position.quantity}{position.market.unit}
                        </span>
                    </dd>
                </S.PositionItem>
                <S.PositionItem>
                    <dt>마진 비율 <span>Margin Ratio</span></dt>
                    <dd>{TypeUtils.round(marginRatio * 100, 2)}%</dd>
                </S.PositionItem>
                <S.PositionItem>
                    <dt>증거금 <span>Margin</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.marginPrice)}</dd>
                </S.PositionItem>
                <S.PositionItem className={`[&>dd]:font-medium ${pnl < 0 ? "short" : "long"}`}>
                    <dt>실현손익 <span>PNL</span></dt>
                    <dd className="flex flex-col w-full">
                        <span>
                            {CryptoUtils.getPriceText(pnl)}
                        </span>
                        <span className="text-xs">
                            {TypeUtils.round(pnlRatio * 100, 2)}%
                        </span>
                    </dd>
                </S.PositionItem>
            </S.PositionBody>

            <S.PositionClose>
                <div className="title">포지션 종료</div>
                <div className="buttons">
                    <button onClick={() => {orderClose(OrderType.LIMIT)}}>지정가</button>
                    <button onClick={() => {orderClose(OrderType.MARKET)}}>시장가</button>
                </div>
                <div className="inputs">
                    <I.NumberInput label={"가격"} value={closePrice} setValue={setClosePrice} />
                    <I.PositionCloseSizeInput label={"크기"} value={closeQuantity} setValue={setCloseQuantity} max={position.quantity} />
                </div>
            </S.PositionClose>
        </S.PositionBox>
    )
}