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
    const [markets, setMarkets] = useState<BitMarket[]>([]) // 코인 목록
    const [marketFiltered, setMarketFiltered] = useState<BitMarket[]>([]) // 검색한 코인 목록
    const [marketType, setMarketType] = useState<MarketTypes>(MarketTypes.KRW) // 마켓 종류 (KRW, BTC, USDT, HOLD)
    const [search, setSearch] = useState<string>("") // 검색어

    const [sortType, setSortType] = useState<MarketSortTypes>(MarketSortTypes.TRADE_PRICE) // 정렬 기준
    const [orderType, setOrderType] = useState<OrderTypes>(OrderTypes.DESC) // 정렬 방식

    const socketDataDic = useMarketPriceStore((state) => state.marketDic)

    useEffect(() => {
        getMarkets(search, marketType)
    }, [marketType])

    useEffect(() => {
        setMarketFiltered(getFilteredMarkets(search, markets))
    }, [search])

    useEffect(() => {
        setOrderType(OrderTypes.DESC)
    }, [sortType])

    const getMarkets = async (_search: string, marketType: MarketTypes) => {
        // 마켓타입에 따른 모든 코인 목록을 가져온다
        const response = await BitApi.getMarkets("", marketType)
        setMarkets(response)

        // 검색어에 따른 코인 목록을 가져온다
        setMarketFiltered(getFilteredMarkets(_search, response))
    }

    const getFilteredMarkets = (_search: string, _markets: Array<BitMarket>): Array<BitMarket> => {
        if (search === "") {
            return _markets
        } else {
            return _markets.filter((market) => {
                return market.koreanName.includes(search) || market.englishName.includes(search) || market.code.includes(search)
            })
        }
    }

    const handleSearch = () => {
        getMarkets(search, marketType)
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
                />
                <MarketSortType 
                    sortType={MarketSortTypes.PRICE}
                    currentSortType={sortType}
                    setSortType={setSortType}
                />
                <MarketSortType 
                    sortType={MarketSortTypes.CHANGE}
                    currentSortType={sortType}
                    setSortType={setSortType}
                />
                <MarketSortType 
                    sortType={MarketSortTypes.TRADE_PRICE}
                    currentSortType={sortType}
                    setSortType={setSortType}
                />
            </div>

            <div className="list">
                {marketFiltered.map((market, index) => (
                    <Market key={index} market={market} socketData={socketDataDic[market.code]} />
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
}
const MarketSortType = ({ sortType, currentSortType, setSortType }: IMarketSortType) => {
    return (
        <button 
            className={`${sortType === currentSortType ? "active" : ""} ${sortType}`}
            onClick={() => setSortType(sortType)}
        >
            {MarketSortTypeNames[sortType]}
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
                <span>
                    {/* <CountUp start={startPrice} end={price} duration={0.3} separator="," /> */}
                    {BitUtils.getPriceText(price)}
                </span>
                <span className="volume">
                    {BitUtils.getTradePriceText(tradePrice24)}
                </span>
            </div>
            <div className="change change-color">
                <span className="rate">{(changeRate * 100).toFixed(2)}%</span>
                {isPriceChangeShow && (
                    <span className="price">{BitUtils.getPriceText(changePrice)}</span>
                )}
            </div>
        </S.MarketListItem>
    )
}