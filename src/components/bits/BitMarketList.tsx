"use client"

import BitApi from "@/apis/api/bits/BitApi"
import useMarketPriceStore from "@/store/useMarketPriceStore"
import * as S from "@/styles/BitMarketStyles"
import { IUpbitMarketTicker } from "@/types/bits/BitInterfaces"
import BitMarket from "@/types/bits/BitMarket"
import { MarketSortTypeNames, MarketSortTypes, MarketTypeNames, MarketTypes, PriceChangeTypes } from "@/types/bits/BitTypes"
import { OrderTypes } from "@/types/common/CommonTypes"
import { TextFormats } from "@/types/CommonTypes"
import BitUtils from "@/utils/BitUtils"
import CommonUtils from "@/utils/CommonUtils"
import Link from "next/link"
import { useEffect, useState } from "react"
import CountUp from "react-countup"

export default function BitMarketList() {
    const socketDataDic = useMarketPriceStore((state) => state.marketDic)

    const [marketDic, setMarketDic] = useState<{ [key:string]: BitMarket}>({}) // 코인 목록
    const [marketFilteredCodeSet, setMarketFilteredCodeSet] = useState<Set<string>>(new Set<string>()) // 검색한 코인 목록
    const [marketType, setMarketType] = useState<MarketTypes>(MarketTypes.KRW) // 마켓 종류 (KRW, BTC, USDT, HOLD)
    const [search, setSearch] = useState<string>("") // 검색어

    const [sortType, setSortType] = useState<MarketSortTypes>(MarketSortTypes.TRADE_PRICE) // 정렬 기준
    const [orderType, setOrderType] = useState<OrderTypes>(OrderTypes.DESC) // 정렬 방식
    const [sortIndexes, setSortIndexes] = useState<number[]>([]) // 정렬된 인덱스
    const [sortedCodes, setSortedCodes] = useState<string[]>([]) // 정렬된 코드

    const [resultCodes, setResultCodes] = useState<string[]>([]) // 결과 코드

    useEffect(() => {
        getMarkets(search, marketType)
    }, [marketType])

    useEffect(() => {
        const filteredSet = getFilteredMarkets(search, Object.values(marketDic))
        setMarketFilteredCodeSet(filteredSet)
    }, [search])

    useEffect(() => {
        setOrderType(OrderTypes.DESC)
    }, [sortType])

    useEffect(() => {
        const _sortedCodes = getSortedCodes(sortType, orderType)
        setSortedCodes(_sortedCodes)

        setResultCodes(_sortedCodes.filter(code => marketFilteredCodeSet.has(code)))
    }, [marketDic, orderType, sortType])

    const getMarkets = async (_search: string, marketType: MarketTypes) => {
        // 마켓타입에 따른 모든 코인 목록을 가져온다
        const response = await BitApi.getMarkets("", marketType)
        setMarketDic(
            response.reduce((acc, market) => {
                acc[market.code] = market
                return acc
            }, {})
        )

        // 검색어에 따른 코인 목록을 가져온다
        const filteredSet = getFilteredMarkets(_search, response)
        setMarketFilteredCodeSet(filteredSet)
    }

    // 검색 결과 정리
    const getFilteredMarkets = (_search: string, _markets: Array<BitMarket>): Set<string> => {
        const keys = new Set<string>()
        if (search === "") {
            _markets.map((market) => {
                keys.add(market.code)
            })
        } else {
            _markets.filter((market) => {
                return market.koreanName.includes(search) || market.englishName.includes(search) || market.code.includes(search)
            }).map((market) => {
                keys.add(market.code)
            })
        }

        return keys
    }
 
    // 코드 정렬하기
    const getSortedCodes = (_sortType: MarketSortTypes, _orderType: OrderTypes): string[] => {
        return Object.keys(marketDic).sort((a, b) => {
            let valueA: string | number
            let valueB: string | number

            if (_sortType === MarketSortTypes.NAME) {
                valueA = marketDic[a].koreanName
                valueB = marketDic[b].koreanName
            } else if (_sortType === MarketSortTypes.PRICE) {
                valueA = socketDataDic[a].trade_price
                valueB = socketDataDic[b].trade_price
            } else if (_sortType === MarketSortTypes.CHANGE) {
                valueA = socketDataDic[a].signed_change_rate
                valueB = socketDataDic[b].signed_change_rate
            } else if (_sortType === MarketSortTypes.TRADE_PRICE) {
                valueA = socketDataDic[a]?.acc_trade_price_24h
                valueB = socketDataDic[b]?.acc_trade_price_24h
            }

            if (valueA < valueB) {
                return _orderType === OrderTypes.ASC ? -1 : 1
            }
            if (valueA > valueB) {
                return _orderType === OrderTypes.ASC ? 1 : -1
            }
            return 0
        })
    }

    return (
        <S.MarketListBox>
            <input 
                type="text"
                value={search}
                placeholder="코인 검색"
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="market-type">
                <MarketType 
                    marketType={MarketTypes.KRW}
                    currentMarketType={marketType}
                    setMarketType={setMarketType}
                />
                <MarketType 
                    marketType={MarketTypes.BTC}
                    currentMarketType={marketType}
                    setMarketType={setMarketType}
                />
                <MarketType 
                    marketType={MarketTypes.USDT}
                    currentMarketType={marketType}
                    setMarketType={setMarketType}
                />
                <MarketType 
                    marketType={MarketTypes.HOLD}
                    currentMarketType={marketType}
                    setMarketType={setMarketType}
                />
            </div>

            <div className="market-sort">
                <MarketSortType 
                    sortType={MarketSortTypes.NAME}
                    currentSortType={sortType}
                    setSortType={setSortType}
                    currentOrderType={orderType}
                    setOrderType={setOrderType}
                />
                <MarketSortType 
                    sortType={MarketSortTypes.PRICE}
                    currentSortType={sortType}
                    setSortType={setSortType}
                    currentOrderType={orderType}
                    setOrderType={setOrderType}
                />
                <MarketSortType 
                    sortType={MarketSortTypes.CHANGE}
                    currentSortType={sortType}
                    setSortType={setSortType}
                    currentOrderType={orderType}
                    setOrderType={setOrderType}
                />
                <MarketSortType 
                    sortType={MarketSortTypes.TRADE_PRICE}
                    currentSortType={sortType}
                    setSortType={setSortType}
                    currentOrderType={orderType}
                    setOrderType={setOrderType}
                />
            </div>

            <div className="list">
                {sortedCodes.filter(code => marketFilteredCodeSet.has(code)).map((marketCode, index) => (
                    <Market key={index} market={marketDic[marketCode]} socketData={socketDataDic[marketCode]} />
                ))}
            </div>
        </S.MarketListBox>
    )
}

interface IMarketType {
    marketType: MarketTypes
    currentMarketType: MarketTypes
    setMarketType: (marketType: MarketTypes) => void
}
const MarketType = ({ marketType, currentMarketType, setMarketType }: IMarketType) => {
    return (
        <button 
            className={marketType === currentMarketType ? "active" : ""}
            onClick={() => setMarketType(marketType)}
        >
            {MarketTypeNames[marketType]}
        </button>
    )
}

interface IMarketSortType {
    sortType: MarketSortTypes
    currentSortType: MarketSortTypes
    setSortType: (sortType: MarketSortTypes) => void
    currentOrderType: OrderTypes
    setOrderType: (orderType: OrderTypes) => void
}
const MarketSortType = ({ sortType, currentSortType, setSortType, currentOrderType, setOrderType }: IMarketSortType) => {
    const handleClick = () => {
        if (sortType === currentSortType) {
            setOrderType(currentOrderType === OrderTypes.ASC ? OrderTypes.DESC : OrderTypes.ASC)
        } else {
            setSortType(sortType)
        }
    }
    return (
        <button 
            className={`${sortType === currentSortType ? "active" : ""} ${sortType}`}
            onClick={() => handleClick()}
        >
            <div className="icon">
                {currentOrderType === OrderTypes.ASC ? (
                    <i className="fa-solid fa-sort-up"></i>
                ) : (
                    <i className="fa-solid fa-sort-down"></i>
                )}
            </div>
            <span>
                {MarketSortTypeNames[sortType]}
            </span>
            <div className="icon !opacity-0">
                <i className="fa-solid fa-sort"></i>
            </div>
        </button>
    )
}

interface IMarket {
    market: BitMarket
    socketData: IUpbitMarketTicker
}
const Market = ({ market, socketData }: IMarket) => {
    const [isPriceChangeShow, setIsPriceChangeShow] = useState<boolean>(false)
    // const socketData = useMarketPriceStore((state) => state.marketDic[market.code])

    const [changeType, setChangeType] = useState<PriceChangeTypes>(market.change)
    const [openingPrice, setOpeningPrice] = useState<number>(market.openingPrice)
    const [price, setPrice] = useState<number>(market.price)
    const [startPrice, setStartPrice] = useState<number>(market.price) // 애니메이션용
    const [tradePrice24, setTradePrice24] = useState<number>(0)
    const [changeRate, setChangeRate] = useState<number>(market.changeRate)
    const [changePrice, setChangePrice] = useState<number>(market.changePrice)

    useEffect(() => {
        setIsPriceChangeShow(market.code.includes("KRW-"))
    }, [market])

    useEffect(() => {
        if (!socketData) return

        setChangeType(BitUtils.getPriceChangeType(socketData.trade_price, socketData.opening_price))
        setOpeningPrice(socketData.opening_price)
        setStartPrice(price) // 애니메이션용
        setPrice(socketData.trade_price)
        setTradePrice24(socketData.acc_trade_price_24h)
        setChangeRate(socketData.signed_change_rate)
        setChangePrice(socketData.signed_change_price)
    }, [socketData])

    if (price < 0) return null

    return (
        <S.MarketListItem
            href={`/crypto/${market.code}`}
            className={`${changeType === PriceChangeTypes.RISE ? "rise" : changeType === PriceChangeTypes.FALL ? "fall" : ""}`}
        >
            <div className="name">
                <span className="korean">{market.koreanName}</span>
                <span className="english">{market.code}</span>
            </div>
            <div className="price change-color">
                <span className="가격">
                    {/* <CountUp start={startPrice} end={price} duration={0.3} separator="," /> */}
                    {BitUtils.getPriceText(price)}
                </span>
                <span className="volume" title="거래대금 (24h)">
                    {BitUtils.getTradePriceText(tradePrice24)}
                </span>
            </div>
            <div className="change change-color">
                <span className="rate" title="전일 대비 변화액">{(changeRate * 100).toFixed(2)}%</span>
                {isPriceChangeShow && (
                    <span className="price" title="전일 대비 변화율">{BitUtils.getPriceText(changePrice)}</span>
                )}
            </div>
        </S.MarketListItem>
    )
}