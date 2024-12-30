"use client"

import * as S from "@/styles/CryptoMyTradeStyles"
import * as I from "@/components/inputs/TradeInputs"
import { MarginModeType, OrderType, PositionType, TradeType } from "@/types/cryptos/CryptoTypes"
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
    marketPrice: number
}
export default function CryptoMyTradePosition({ user, market, marketPrice }: ICryptoMyTradePosition) {
    const [positions, setPositions] = useState<Array<TradePosition>>([])

    useEffect(() => {
        if (!CommonUtils.isStringNullOrEmpty(user.uuid)) {
            getPositions()
        }    
    }, [user.uuid, market])

    const getPositions = useCallback(() => {
        CryptoApi.getTradePostions().then((response) => {
            console.log(response)
            setPositions(response)
        })
    }, [market.code])

    return (
        <S.PageLayout className="min-h-[48rem] h-fit p-2 space-y-2">
            {positions.map((position, index) => (
                <Position key={index} position={position} />
            ))}
        </S.PageLayout>
    )
}

interface IPosition {
    position: TradePosition
}
const Position = ({ market, position }: IPosition) => {
    const socketData = useMarketPriceStore((state) => state.marketDic[position.market.code])
    const marketPrice = socketData ? socketData.trade_price : 0

    const [bep, setBep] = useState<number>(0)
    const [size, setSize] = useState<number>(0)
    const [marginRatio, setMarginRatio] = useState<number>(0)
    const [pnl, setPnl] = useState<number>(0)

    useEffect(() => {
        const _size = position.quantity * marketPrice
        setSize(_size)

        const breakEvenPrice = position.totalFee / position.quantity
        setBep(position.averagePrice + CryptoUtils.getPriceRound(breakEvenPrice))
        setMarginRatio(position.marginPrice / position.quantity)
        setPnl(CryptoUtils.getPnl(marketPrice, position.quantity, position.averagePrice, position.positionType))
    }, [position, marketPrice])

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
                </div>

                <div className="right">
                    <div className="value">
                        {CommonUtils.round(position.averageLeverage, 2)}x
                    </div>
                </div>
            </S.PositionHeader>

            <S.PositionBody>
                <S.PositionItem className={``}>
                    <dt>현재가격 <span>Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(marketPrice)}</dd>
                </S.PositionItem>
                <S.PositionItem className={``}>
                    <dt>진입가격 <span>Entry Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.averagePrice)}</dd>
                </S.PositionItem>
                <S.PositionItem>
                    <dt>손익분기점 <span>Break Even Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(bep)}</dd>
                </S.PositionItem>
                <S.PositionItem className={`${position.positionType === PositionType.LONG ? "long" : "short"}`}>
                    <dt>포지션 크기 <span>Size</span></dt>
                    <dd>{position.positionType === PositionType.SHORT && "-"}{CryptoUtils.getPriceText(size)}</dd>
                </S.PositionItem>
                <S.PositionItem>
                    <dt>청산가격 <span>Liq.Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.liquidatePrice)}</dd>
                </S.PositionItem>
                <S.PositionItem>
                    <dt>Margin Ratio</dt>
                    <dd>{CommonUtils.textFormat(marginRatio, TextFormats.NUMBER)}</dd>
                </S.PositionItem>
                <S.PositionItem>
                    <dt>증거금 <span>Margin</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.marginPrice)}</dd>
                </S.PositionItem>
                <S.PositionItem className={pnl < 0 ? "short" : "long"}>
                    <dt>실현손익 <span>PNL</span></dt>
                    <dd>{CryptoUtils.getPriceText(pnl)}</dd>
                </S.PositionItem>
            </S.PositionBody>
        </S.PositionBox>
    )
}