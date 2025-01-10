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
import CryptoMarket from "@/types/cryptos/CryptoMarket"
import CryptoMyTradePosition from "./CryptoMyTradePosition"
import User from "@/types/users/User"
import CryptoMyTradeOrder from "./CryptoMyTradeOrder"

export enum MyTradePage {
    POSITION,
    ORDER,
    ORDER_HISTORY,
    TRADE_HISTORY
}
const MyTradePageNames = {
    [MyTradePage.POSITION]: "포지션",
    [MyTradePage.ORDER]: "주문",
    [MyTradePage.ORDER_HISTORY]: "주문 내역",
    [MyTradePage.TRADE_HISTORY]: "거래 내역"
}

interface ICryptoMyTrade {
    user: User
    market: CryptoMarket
    marketPrice: number
}
export default function CryptoMyTrade({ user, market, marketPrice }: ICryptoMyTrade) {
    const { balance, updateInfo } = useUserInfoStore()
    const userBudget = balance

    const [page, setPage] = useState<MyTradePage>(MyTradePage.POSITION)


    return (
        <S.Layout>
            <S.PageTabBar>
                <PageTab page={MyTradePage.POSITION} setPage={setPage} currentPage={page} />
                <PageTab page={MyTradePage.ORDER} setPage={setPage} currentPage={page} />
                <PageTab page={MyTradePage.ORDER_HISTORY} setPage={setPage} currentPage={page} />
                <PageTab page={MyTradePage.TRADE_HISTORY} setPage={setPage} currentPage={page} />
            </S.PageTabBar>

            {page === MyTradePage.POSITION && (
                <CryptoMyTradePosition user={user} market={market} />
            )}
            {page === MyTradePage.ORDER && (
                <CryptoMyTradeOrder user={user} market={market} />
            )}
        </S.Layout>
    )
}

interface IPageTabBar {
    page: MyTradePage
    setPage: React.Dispatch<React.SetStateAction<MyTradePage>>
    currentPage: MyTradePage
}
const PageTab = ({ page, setPage, currentPage }: IPageTabBar) => {
    return (
        <button 
            onClick={() => {setPage(page)}}
            className={`tab ${page === currentPage ? "active" : ""}`}
        >
            {MyTradePageNames[page]}
        </button>
    )
}