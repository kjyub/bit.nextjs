"use client"

import * as MS from "@/styles/MainStyles"
import * as S from "@/styles/BitMarketStyles"
import BitNavigation from "./BitNavigation"
import BitMarketList from "./BitMarketList"
import { IUpbitMarketTicker } from "@/types/bits/BitInterfaces"
import UpbitApi from "@/apis/api/bits/UpbitApi"
import { useEffect, useState } from "react"
import useMarketPriceStore from "@/store/useMarketPriceStore"
import BitMarket from "@/types/bits/BitMarket"
import BitUtils from "@/utils/BitUtils"
import Image from "next/image"
import CommonUtils from "@/utils/CommonUtils"
import { TextFormats } from "@/types/CommonTypes"
import { PriceChangeTypes } from "@/types/bits/BitTypes"
import CountUp from "react-countup"

interface IBitMarket {
    marketCode: string
    marketData: object
    marketCurrent: IUpbitMarketTicker
}
export default function BitMarketMain({ marketCode, marketData, marketCurrent }: IBitMarket) {
    const market = new BitMarket()
    market.parseResponse(marketData)

    const imageCode = marketCode.split('-')[1]
    const currency = marketCode.split('-')[0]

    const socketData = useMarketPriceStore((state) => state.marketDic[marketCode])

    const [changeType, setChangeType] = useState<PriceChangeTypes>(market.change)
    const [openingPrice, setOpeningPrice] = useState<number>(market.openingPrice)
    const [price, setPrice] = useState<number>(marketCurrent.trade_price)
    const [startPrice, setStartPrice] = useState<number>(marketCurrent.trade_price) // 애니메이션용
    const [changeRate, setChangeRate] = useState<number>(market.changeRate)
    const [changePrice, setChangePrice] = useState<number>(market.changePrice)

    const [priceWidth, setPriceWidth] = useState<number>(0)

    useEffect(() => {
        if (!socketData) return

        setChangeType(BitUtils.getPriceChangeType(socketData.trade_price, socketData.opening_price))
        setOpeningPrice(socketData.opening_price)
        setStartPrice(price) // 애니메이션용
        setPrice(socketData.trade_price)
        setChangeRate(socketData.signed_change_rate)
        setChangePrice(socketData.signed_change_price)
    }, [socketData])

    useEffect(() => {
        setPriceWidth((BitUtils.getPriceTextLength(price) * 15) + 30)
    }, [price])
    
    
    return (
        <>
            {/* 코인 정보 */}
            <S.MainLayout>
                <S.TitleLayout className="test-border2">
                    <div className="flex flex-col">
                        {/* 코인 이름 */}
                        <S.MainTitleBox>
                            <div className="relative flex flex-cetner w-[28px] aspect-square">
                                <Image
                                    fill={true}
                                    src={`https://static.upbit.com/logos/${imageCode}.png`}
                                    alt="coin"
                                />
                            </div>
                            <h1 className="text-3xl text-slate-50 font-semibold">{market.koreanName}</h1>
                            <div className="flex flex-col">
                                <h2 className="text-sm text-slate-400">{market.englishName}</h2>
                                <h2 className="text-[10px] text-slate-500">{market.code}</h2>
                            </div>
                        </S.MainTitleBox>

                        {/* 코인 가격 */}
                        <S.MainPriceBox
                            className={`${changeType === PriceChangeTypes.RISE ? "rise" : changeType === PriceChangeTypes.FALL ? "fall" : ""} change`}
                        >
                            <span className={`price w-[${priceWidth}px]`}>
                                {/* <CountUp start={startPrice} end={price} duration={0.3} separator="," />  */}
                                {BitUtils.getPriceText(price)}
                                <span className="currency">{currency}</span>
                            </span>

                            <div className="change">
                                <span className="rate">{(changeRate * 100).toFixed(2)}%</span>
                                <span className="price">
                                    {BitUtils.getPriceText(changePrice)}
                                    <span className="currency">{currency}</span>
                                </span>
                            </div>
                        </S.MainPriceBox>
                    </div>

                    <div className="flex flex-col pt-4">
                        <S.MainPriceInfoGrid>
                            <div>
                                <span className="label">고가</span>
                                <span className="value w-32 rise">{BitUtils.getPriceText(marketCurrent.high_price)}</span>
                            </div>
                            <div>
                                <span className="label">거래량(24h)</span>
                                <span className="value w-36 text-xs">{marketCurrent.acc_trade_volume_24h}</span>
                            </div>
                            <div>
                                <span className="label">저가</span>
                                <span className="value w-32 fall">{BitUtils.getPriceText(marketCurrent.low_price)}</span>
                            </div>
                            <div>
                                <span className="label">거래대금(24h)</span>
                                <span className="value w-36 text-xs">{BitUtils.getPriceText(marketCurrent.acc_trade_price_24h)}</span>
                            </div>
                        </S.MainPriceInfoGrid>
                    </div>
                </S.TitleLayout>
                
                <S.ChartAndTradeLayout>
                    <S.ChartLayout className="rounded-lg bg-slate-800/60">

                    </S.ChartLayout>
                    <S.TradeLayout className="test-border">

                    </S.TradeLayout>
                </S.ChartAndTradeLayout>
            </S.MainLayout>

            <S.CommunityLayout className="test-border">
                commu
            </S.CommunityLayout>
        </>
    )
}