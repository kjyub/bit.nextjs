'use client'

import useUserInfoStore from '@/store/useUserInfo'
import * as S from '@/styles/CryptoMyTradeStyles'
import { useState } from 'react'
import CryptoMyTradeHistory from './CryptoMyTradeHistory'
import CryptoMyTradeOrder from './CryptoMyTradeOrder'
import CryptoMyTradeOrderHistory from './CryptoMyTradeOrderHistory'
import CryptoMyTradePosition from './CryptoMyTradePosition'
import CryptoMyTradePositionHistory from './CryptoMyTradePositionHistory'

export enum MyTradePage {
  POSITION,
  ORDER,
  ORDER_HISTORY,
  TRADE_HISTORY,
  POSITION_HISTORY,
}
const MyTradePageNames = {
  [MyTradePage.POSITION]: '포지션',
  [MyTradePage.ORDER]: '주문',
  [MyTradePage.ORDER_HISTORY]: '주문 내역',
  [MyTradePage.TRADE_HISTORY]: '거래 내역',
  [MyTradePage.POSITION_HISTORY]: '포지션 내역',
}

export default function CryptoMyTrade() {
  const { myTrades } = useUserInfoStore()

  const [page, setPage] = useState<MyTradePage>(MyTradePage.POSITION)

  return (
    <S.Layout>
      <S.PageTabBar>
        <PageTab page={MyTradePage.POSITION} setPage={setPage} currentPage={page} count={myTrades.positions.length} />
        <PageTab page={MyTradePage.ORDER} setPage={setPage} currentPage={page} count={myTrades.orders.length} />
        <PageTab page={MyTradePage.ORDER_HISTORY} setPage={setPage} currentPage={page} />
        <PageTab page={MyTradePage.TRADE_HISTORY} setPage={setPage} currentPage={page} />
        <PageTab page={MyTradePage.POSITION_HISTORY} setPage={setPage} currentPage={page} />
      </S.PageTabBar>

      {page === MyTradePage.POSITION && <CryptoMyTradePosition />}
      {page === MyTradePage.ORDER && <CryptoMyTradeOrder />}
      {page === MyTradePage.ORDER_HISTORY && <CryptoMyTradeOrderHistory />}
      {page === MyTradePage.TRADE_HISTORY && <CryptoMyTradeHistory />}
      {page === MyTradePage.POSITION_HISTORY && <CryptoMyTradePositionHistory />}
    </S.Layout>
  )
}

interface IPageTabBar {
  page: MyTradePage
  setPage: React.Dispatch<React.SetStateAction<MyTradePage>>
  currentPage: MyTradePage
  count?: number
}
const PageTab = ({ page, setPage, currentPage, count }: IPageTabBar) => {
  return (
    <button
      onClick={() => {
        setPage(page)
      }}
      className={`tab ${page === currentPage ? 'active' : ''}`}
    >
      {MyTradePageNames[page]}
      {count > 0 && ` (${count})`}
    </button>
  )
}
