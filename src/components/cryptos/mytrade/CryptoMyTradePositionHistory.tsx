"use client"

import * as S from "@/styles/CryptoMyTradeStyles"
import * as I from "@/components/inputs/TradeInputs"
import { MarginModeType, TradeOrderTypeNames, PositionType, PriceChangeTypes, SizeUnitTypes, TradeType, MarginModeTypeNames } from "@/types/cryptos/CryptoTypes"
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
import CryptoMyTradeItemSkeleton from "./ItemSkeleton"
import usePageScroll from "@/hooks/usePageScroll"

const PAGE_SIZE = 10

interface ICryptoMyTradePositionHistory {
    user: User
}
export default function CryptoMyTradePositionHistory({ user }: ICryptoMyTradePositionHistory) {
    const [positions, setPositions] = useState<Array<TradePosition>>([])
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
        const response = await CryptoApi.getTradePositionHistories(_pageIndex, 50, dateStart, dateEnd)
        
        if (_pageIndex === 1) {
            setPositions(response.items)
        } else {
            setPositions([...positions, ...response.items])
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
        
            <S.PageList $is_active={positions.length > 0}>
                {positions.map((position, index) => (
                    <Position key={index} position={position} />
                ))}

                <CryptoMyTradeItemSkeleton ref={scrollRef} pageIndex={pageIndex} itemCount={itemCount} pageSize={PAGE_SIZE} />
            </S.PageList>
        </S.PageLayout>
    )
}

interface IPosition {
    position: TradePosition
}
const Position = ({ position }: IPosition) => {
    return (
        <S.OrderBox>
            <S.OrderHeader>
                <div className="left">
                    <div className={`position ${position.positionType !== PositionType.LONG ? "long" : "short"}`}>
                        {position.positionType === PositionType.LONG ? "LONG" : "SHORT"}
                    </div>

                    <p className="title">
                        <span className="korean">
                            {position.market.koreanName}
                        </span>
                        <span className="code">
                            {position.market.code}
                        </span>
                    </p>
                </div>

                <div className="right">
                    <div className="value">
                        {MarginModeTypeNames[position.marginMode]}
                    </div>
                </div>
            </S.OrderHeader>
        

            <S.OrderBody>
                <S.OrderItem className={``}>
                    <dt>진입 가격 <span>Entry Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.entryPrice)}</dd>
                </S.OrderItem>
                <S.OrderItem className={``}>
                    <dt>평균 종료 가격 <span>Avg. Close Price</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.averageClosePrice)}</dd>
                </S.OrderItem>
                <S.OrderItem className={`col-span-2 ${position.pnl > 0 ? "long" : "short"}`}>
                    <dt>손익 <span>Closing PNL</span></dt>
                    <dd>{CryptoUtils.getPriceText(position.pnl)}TW</dd>
                </S.OrderItem>
                <S.OrderItem className={``}>
                    <dt>시작 일시 <span>Opened</span></dt>
                    <dd>{dayjs(position.entryTime).format("YYYY-MM-DD HH:mm:ss")}</dd>
                </S.OrderItem>
                <S.OrderItem className={``}>
                    <dt>종료 일시 <span>Closed</span></dt>
                    <dd>{dayjs(position.closeTime).format("YYYY-MM-DD HH:mm:ss")}</dd>
                </S.OrderItem>
            </S.OrderBody>
        </S.OrderBox>
    )
}