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
import TradeHistory from "@/types/cryptos/TradeHistory"
import CryptoMyTradeFilter from "./Filter"
import CryptoMyTradeItemSkeleton from "./ItemSkeleton"
import usePageScroll from "@/hooks/usePageScroll"

const PAGE_SIZE = 10

interface ICryptoMyTradeHistory {
    user: User
}
export default function CryptoMyTradeHistory({ user }: ICryptoMyTradeHistory) {
    const [histories, setHistories] = useState<Array<TradeHistory>>([])
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
        const response = await CryptoApi.getTradeHistories(_pageIndex, 50, dateStart, dateEnd)
        
        if (_pageIndex === 1) {
            setHistories(response.items)
        } else {
            setHistories([...histories, ...response.items])
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

            <S.PageList $is_active={histories.length > 0}>
                {histories.map((history, index) => (
                    <History key={index} history={history} />
                ))}

                <CryptoMyTradeItemSkeleton ref={scrollRef} pageIndex={pageIndex} itemCount={itemCount} pageSize={PAGE_SIZE} />
            </S.PageList>
        </S.PageLayout>
    )
}

interface IHistory {
    history: TradeHistory
}
const History = ({ history }: IHistory) => {
    return (
        <S.OrderBox>
            <S.OrderHeader>
                <div className="left">
                    <div className="datetime">
                        <i className="fa-solid fa-clock"></i>
                        <span>
                            {dayjs(history.createdDate).format("YYYY-MM-DD HH:mm:ss")}
                        </span>
                    </div>
                    
                    <div className={`position ${history.positionType === PositionType.LONG ? "long" : "short"}`}>
                        {history.positionType === PositionType.LONG ? "LONG" : "SHORT"}
                    </div>

                    <p className="title">
                        <span className="korean">
                            {history.order.market.koreanName}
                        </span>
                        <span className="code">
                            {history.order.market.code}
                        </span>
                    </p>
                </div>

                <div className="right">
                    <div className="value">
                        {TradeOrderTypeNames[history.orderType]}
                    </div>
                </div>
            </S.OrderHeader>
        

            <S.OrderBody>
                <S.OrderItem className={``}>
                    <dt>가격 <span>Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(history.price)}</dd>
                </S.OrderItem>
                <S.OrderItem className={``}>
                    <dt>수량 <span>Quantity</span></dt>
                    <dd>{CryptoUtils.getPriceText(history.price * history.quantity)}TW</dd>
                </S.OrderItem>
                <S.OrderItem className={``}>
                    <dt>수수료 <span>Fee</span></dt>
                    <dd>{CryptoUtils.getPriceText(history.fee)}TW</dd>
                </S.OrderItem>
                <S.OrderItem className={``}>
                    <dt>실현손익 <span>Realized Profit</span></dt>
                    <dd>{CryptoUtils.getPriceText(history.pnl)}TW</dd>
                </S.OrderItem>
            </S.OrderBody>
        </S.OrderBox>
    )
}