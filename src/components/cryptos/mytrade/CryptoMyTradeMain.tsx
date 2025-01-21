"use client"

import * as S from "@/styles/CryptoMyTradeStyles"
import * as I from "@/components/inputs/TradeInputs"
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
import CryptoMyTradeOrderHistory from "./CryptoMyTradeOrderHistory"
import CryptoMyTradeHistory from "./CryptoMyTradeHistory"
import CryptoMyTradePositionHistory from "./CryptoMyTradePositionHistory"

export enum MyTradePage {
    POSITION,
    ORDER,
    ORDER_HISTORY,
    TRADE_HISTORY,
    POSITION_HISTORY,
}
const MyTradePageNames = {
    [MyTradePage.POSITION]: "포지션",
    [MyTradePage.ORDER]: "주문",
    [MyTradePage.ORDER_HISTORY]: "주문 내역",
    [MyTradePage.TRADE_HISTORY]: "거래 내역",
    [MyTradePage.POSITION_HISTORY]: "포지션 내역"
}

interface ICryptoMyTrade {
    user: User
}
export default function CryptoMyTrade({ user }: ICryptoMyTrade) {
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
                <PageTab page={MyTradePage.POSITION_HISTORY} setPage={setPage} currentPage={page} />
            </S.PageTabBar>

            {page === MyTradePage.POSITION && (
                <CryptoMyTradePosition user={user} />
            )}
            {page === MyTradePage.ORDER && (
                <CryptoMyTradeOrder user={user} />
            )}
            {page === MyTradePage.ORDER_HISTORY && (
                <CryptoMyTradeOrderHistory user={user} />
            )}
            {page === MyTradePage.TRADE_HISTORY && (
                <CryptoMyTradeHistory user={user} />
            )}
            {page === MyTradePage.POSITION_HISTORY && (
                <CryptoMyTradePositionHistory user={user} />
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