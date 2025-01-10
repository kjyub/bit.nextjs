"use client"

import * as S from "@/styles/CryptoMyTradeStyles"
import * as I from "@/components/inputs/TradeInputs"
import { MarginModeType, OrderType, OrderTypeNames, PositionType, PriceChangeTypes, SizeUnitTypes, TradeType } from "@/types/cryptos/CryptoTypes"
import { useCallback, useEffect, useRef, useState } from "react"
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
import TradeOrder from "@/types/cryptos/TradeOrder"
import dayjs from "dayjs"

interface ICryptoMyTradeOrder {
    user: User
    market: CryptoMarket
}
export default function CryptoMyTradeOrder({ user, market }: ICryptoMyTradeOrder) {
    const [orders, setOrders] = useState<Array<TradePosition>>([])

    useEffect(() => {
        if (!CommonUtils.isStringNullOrEmpty(user.uuid)) {
            getPositions()
        }    
    }, [user.uuid, market])

    const getPositions = useCallback(() => {
        CryptoApi.getTradeOrders().then((response) => {
            setOrders(response)
        })
    }, [market.code])

    return (
        <S.PageLayout className="min-h-[48rem] h-fit p-2 space-y-2">
            {orders.map((order, index) => (
                <Order key={index} order={order} />
            ))}
        </S.PageLayout>
    )
}

interface IOrder {
    order: TradeOrder
}
const Order = ({ market, order }: IOrder) => {
    const ref = useRef<HTMLDivElement>(null)

    const handleCancel = async () => {
        if (!confirm("주문을 취소하시겠습니까?")) {
            return
        }

        const response = await CryptoApi.orderLimitCancel(order.id)

        if (response) {
            alert("주문이 취소되었습니다.")
            ref.current?.remove()
        } else {
            alert("주문 취소에 실패했습니다.")
        }
    }

    return (
        <S.OrderBox ref={ref}>
            <S.OrderHeader>
                <div className="left">
                    <div className="datetime">
                        <i className="fa-solid fa-clock"></i>
                        <span>
                            {dayjs(order.createdDate).format("YYYY-MM-DD HH:mm:ss")}
                        </span>
                    </div>

                    <p className="title">
                        <span className="korean">
                            {order.market.koreanName}
                        </span>
                        <span className="code">
                            {order.market.code}
                        </span>
                    </p>
                </div>

                <div className="right">
                    <div className="value">
                        {OrderTypeNames[order.orderType]}
                    </div>
                    <button className="value !text-yellow-500" onClick={() => {handleCancel()}}>
                        취소
                    </button>
                </div>
            </S.OrderHeader>

            <S.OrderBody>
                <S.OrderItem className={``}>
                    <dt>가격 <span>Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(order.entryPrice)}</dd>
                </S.OrderItem>
                <S.OrderItem className={``}>
                    <dt>수량 <span>Amount</span></dt>
                    <dd>{CryptoUtils.getPriceText(order.size)}TW</dd>
                </S.OrderItem>
                <S.OrderItem className={`${order.positionType === PositionType.LONG ? "long" : "short"}`}>
                    <dt>방향 <span>Side</span></dt>
                    <dd>{order.positionType === PositionType.LONG ? "롱" : "숏"}</dd>
                </S.OrderItem>
            </S.OrderBody>

            {/* <S.PositionClose>
                <div className="title">포지션 종료</div>
                <div className="buttons">
                    <button onClick={() => {orderClose(OrderType.LIMIT)}}>지정가</button>
                    <button onClick={() => {orderClose(OrderType.MARKET)}}>시장가</button>
                </div>
                <div className="inputs">
                    <I.NumberInput label={"가격"} value={closePrice} setValue={setClosePrice} />
                    <I.PositionCloseSizeInput label={"크기"} value={closeQuantity} setValue={setCloseQuantity} max={order.quantity} />
                </div>
            </S.PositionClose> */}
        </S.OrderBox>
    )
}