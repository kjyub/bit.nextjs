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
import CryptoMyTradeFilter from "./Filter"
import usePageScroll from "@/hooks/usePageScroll"
import Pagination from "@/types/api/pagination"
import CryptoMyTradeItemSkeleton from "./ItemSkeleton"

const PAGE_SIZE = 10

interface ICryptoMyTradeOrderHistory {
    user: User
}
export default function CryptoMyTradeOrderHistory({ user }: ICryptoMyTradeOrderHistory) {
    const [orders, setOrders] = useState<Array<TradeOrder>>([])
    const [pageIndex, setPageIndex] = useState<number>(1)
    const [itemCount, setItemCount] = useState<number>(0)
    const [isLoading, setLoading] = useState<boolean>(false)

    const [dateStart, setDateStart] = useState<string>("")
    const [dateEnd, setDateEnd] = useState<string>("")

    const getHistories = async (_pageIndex: number, dateStart: string = "", dateEnd: string = "") => {
        if (isLoading) {
            return
        }

        setLoading(true)
        const response = await CryptoApi.getTradeOrderHistories(_pageIndex, PAGE_SIZE, dateStart, dateEnd)
        
        if (_pageIndex === 1) {
            setOrders(response.items)
        } else {
            setOrders([...orders, ...response.items])
        }
        setPageIndex(response.pageIndex >= 0 ? response.pageIndex : _pageIndex)
        setItemCount(response.count)
        setDateStart(dateStart)
        setDateEnd(dateEnd)
        setLoading(false)
    }

    const handleNextPage = () => {
        getHistories(pageIndex + 1, dateStart, dateEnd)
    }

    const handleSearch = (_dateStart: string, _dateEnd: string) => {
        getHistories(1, _dateStart, _dateEnd)
    }

    const scrollRef = usePageScroll({
        nextPage: handleNextPage, 
        pageIndex: pageIndex,
        itemCount: itemCount,
        pageSize: PAGE_SIZE
    })

    return (
        <S.PageLayout className="p-2 space-y-2">
            <CryptoMyTradeFilter onSearch={handleSearch} />

            <S.PageList $is_active={orders.length > 0}>
                {orders.map((order, index) => (
                    <Order key={index} order={order} />
                ))}

                <CryptoMyTradeItemSkeleton ref={scrollRef} pageIndex={pageIndex} itemCount={itemCount} pageSize={PAGE_SIZE} />
            </S.PageList>
        </S.PageLayout>
    )
}

interface IOrder {
    order: TradeOrder
}
const Order = ({ order }: IOrder) => {
    return (
        <S.OrderBox>
            <S.OrderHeader>
                <div className="left">
                    <div className="datetime">
                        <i className="fa-solid fa-clock"></i>
                        <span>
                            {dayjs(order.createdDate).format("YYYY-MM-DD HH:mm:ss")}
                        </span>
                    </div>
                    
                    <div className={`position ${order.positionType === PositionType.LONG ? "long" : "short"}`}>
                        {order.positionType === PositionType.LONG ? "LONG" : "SHORT"}
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
                    <div className={`value ${order.isCancel ? "text-slate-400!" : "text-violet-500!"}`}>
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
                <S.OrderItem className={``}>
                    <dt>타입 <span>Type</span></dt>
                    <dd>{TradeOrderTypeNames[order.orderType]}</dd>
                </S.OrderItem>
                <S.OrderItem className={``}>
                    <dt>트리거 <span>Trigger</span></dt>
                    <dd>-</dd>
                </S.OrderItem>
            </S.OrderBody>
        </S.OrderBox>
    )
}