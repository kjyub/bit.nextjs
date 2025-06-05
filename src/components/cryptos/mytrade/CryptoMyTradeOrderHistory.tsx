'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import usePageScroll from '@/hooks/usePageScroll';
import * as S from '@/styles/CryptoMyTradeStyles';
import { PositionTypes, TradeOrderTypeNames } from '@/types/cryptos/CryptoTypes';
import type TradeOrder from '@/types/cryptos/TradeOrder';
import CryptoUtils from '@/utils/CryptoUtils';
import dayjs from 'dayjs';
import { useState } from 'react';
import CryptoMyTradeFilter from './Filter';
import CryptoMyTradeItemSkeleton from './ItemSkeleton';

const PAGE_SIZE = 10;

export default function CryptoMyTradeOrderHistory() {
  const [orders, setOrders] = useState<Array<TradeOrder>>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [itemCount, setItemCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');

  const getHistories = async (_pageIndex: number, dateStart = '', dateEnd = '') => {
    if (isLoading) {
      return;
    }

    setLoading(true);
    const response = await CryptoApi.getTradeOrderHistories(_pageIndex, PAGE_SIZE, dateStart, dateEnd);

    if (_pageIndex === 1) {
      setOrders(response.items);
    } else {
      setOrders([...orders, ...response.items]);
    }
    setPageIndex(response.pageIndex >= 0 ? response.pageIndex : _pageIndex);
    setItemCount(response.count);
    setDateStart(dateStart);
    setDateEnd(dateEnd);
    setLoading(false);
  };

  const handleNextPage = () => {
    getHistories(pageIndex + 1, dateStart, dateEnd);
  };

  const handleSearch = (_dateStart: string, _dateEnd: string) => {
    getHistories(1, _dateStart, _dateEnd);
  };

  const scrollRef = usePageScroll<HTMLDivElement>({
    nextPage: handleNextPage,
    pageIndex: pageIndex,
    itemCount: itemCount,
    pageSize: PAGE_SIZE,
  });

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
  );
}

interface IOrder {
  order: TradeOrder;
}
const Order = ({ order }: IOrder) => {
  return (
    <S.OrderBox>
      <S.OrderHeader>
        <div className="sm:!hidden datetime">
          <i className="fa-solid fa-clock"></i>
          <span>{dayjs(order.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>

        <div className="row">
          <div className="section">
            <div className="max-sm:!hidden datetime">
              <i className="fa-solid fa-clock"></i>
              <span>{dayjs(order.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>

            <div className={`position ${order.positionType === PositionTypes.LONG ? 'long' : 'short'}`}>
              {order.positionType === PositionTypes.LONG ? 'LONG' : 'SHORT'}
            </div>

            <p className="title">
              <span className="korean">{order.market.koreanName}</span>
              <span className="code">{order.market.code}</span>
            </p>
          </div>

          <div className="section info">
            <div className={`value ${order.isCancel ? 'text-slate-400!' : 'text-violet-500!'}`}>
              {order.isCancel ? '취소됨' : '처리됨'}
            </div>
          </div>
        </div>
      </S.OrderHeader>

      <S.OrderBody>
        <S.OrderItem className={''}>
          <dt>
            가격 <span>Price</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(order.entryPrice)}</dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            수량 <span>Amount</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(order.size)}TW</dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            타입 <span>Type</span>
          </dt>
          <dd>{TradeOrderTypeNames[order.orderType]}</dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            트리거 <span>Trigger</span>
          </dt>
          <dd>-</dd>
        </S.OrderItem>
      </S.OrderBody>
    </S.OrderBox>
  );
};
