"use client"

import * as S from "@/styles/CryptoMyTradeStyles"
import * as I from "@/components/inputs/TradeInputs"
import { MarginModeType, TradeOrderTypeNames, PositionType, PriceChangeTypes, SizeUnitTypes, TradeType } from "@/types/cryptos/CryptoTypes"
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
import TradeGoApi from "@/apis/api/cryptos/TradeGoApi"
import { IUpbitMarketTicker } from "@/types/cryptos/CryptoInterfaces"

interface ICryptoMyTradeOrderHistory {
    user: User
    market: CryptoMarket
}
export default function CryptoMyTradeOrderHistory({ user, market }: ICryptoMyTradeOrderHistory) {
    const [orders, setOrders] = useState<Array<TradePosition>>([])
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [itemCount, setItemCount] = useState<number>(0)

    useEffect(() => {
        if (!CommonUtils.isStringNullOrEmpty(user.uuid)) {
            getPositions(1)
        }
    }, [user.uuid, market])

    const getPositions = useCallback(async (_pageIndex: number) => {
        const response = await CryptoApi.getTradeOrderHistories(market.code, _pageIndex, 50)
        
        setOrders(response.items)
        setPageIndex(response.pageIndex >= 0 ? response.pageIndex : _pageIndex)
        setItemCount(response.count)
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

    const handleChase = async () => {
        if (!confirm("주문을 추격하시겠습니까?")) {
            return
        }

        const market: IUpbitMarketTicker = await TradeGoApi.getMarketCurrent(order.market.code)
        if (CommonUtils.isNullOrUndefined(market) || CommonUtils.isNullOrUndefined(String(market.trade_price))) {
            alert("마켓 정보를 가져오는데 실패했습니다.")
            return
        }
        
        const response = await CryptoApi.orderLimitChase(order.id, market.trade_price)

        if (!response) {
            alert("주문 추격에 실패했습니다.")
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
                    <div className={`value ${order.isCancel ? "!text-slate-400" : "!text-green-500"}`}>
                        {order.isCancel ? "취소됨" : "처리됨"}
                    </div>
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
                <S.OrderItem className={``}>
                    <dt>트리거 <span>Trigger</span></dt>
                    <dd>-</dd>
                </S.OrderItem>
            </S.OrderBody>
        </S.OrderBox>
    )
}