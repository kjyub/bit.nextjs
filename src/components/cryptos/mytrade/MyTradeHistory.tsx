'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import { CRYPTO_WALLET_UNIT } from '@/constants/CryptoConsts';
import usePageScroll from '@/hooks/usePageScroll';
import * as S from '@/styles/CryptoMyTradeStyles';
import { PositionTypes, TradeOrderTypeNames } from '@/types/cryptos/CryptoTypes';
import type TradeHistory from '@/types/cryptos/TradeHistory';
import CryptoUtils from '@/utils/CryptoUtils';
import dayjs from 'dayjs';
import { useState } from 'react';
import CryptoMyTradeFilter from './Filter';
import HeaderLink from './HeaderLink';
import CryptoMyTradeItemSkeleton from './ItemSkeleton';

const PAGE_SIZE = 10;

export default function CryptoMyTradeHistory() {
  const [histories, setHistories] = useState<Array<TradeHistory>>([]);
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
    const response = await CryptoApi.getTradeHistories(_pageIndex, 50, dateStart, dateEnd);

    if (_pageIndex === 1) {
      setHistories(response.items);
    } else {
      setHistories([...histories, ...response.items]);
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

      <S.PageList $is_active={histories.length > 0}>
        {histories.map((history, index) => (
          <History key={index} history={history} />
        ))}

        <CryptoMyTradeItemSkeleton ref={scrollRef} pageIndex={pageIndex} itemCount={itemCount} pageSize={PAGE_SIZE} />
      </S.PageList>
    </S.PageLayout>
  );
}

interface IHistory {
  history: TradeHistory;
}
const History = ({ history }: IHistory) => {
  return (
    <S.OrderBox>
      <S.OrderHeader>
        <div className="sm:!hidden datetime">
          <i className="fa-solid fa-clock"></i>
          <span>{dayjs(history.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>

        <div className="row">
          <div className="section">
            <div className="max-sm:!hidden datetime">
              <i className="fa-solid fa-clock"></i>
              <span>{dayjs(history.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>

            <div className={`position ${history.positionType === PositionTypes.LONG ? 'long' : 'short'}`}>
              {history.positionType === PositionTypes.LONG ? 'LONG' : 'SHORT'}
            </div>

            <HeaderLink href={`/crypto/${history.order.market.code}`} className="title">
              <span className="korean">{history.order.market.koreanName}</span>
              <span className="code">{history.order.market.code}</span>
            </HeaderLink>
          </div>

          <div className="section">
            <div className="info">{TradeOrderTypeNames[history.orderType]}</div>
          </div>
        </div>
      </S.OrderHeader>

      <S.OrderBody>
        <S.OrderItem className={''}>
          <dt>
            가격 <span>Price</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(history.price)}</dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            수량 <span>Quantity</span>
          </dt>
          <dd>
            {CryptoUtils.getPriceText(history.price * history.quantity)}
            {CRYPTO_WALLET_UNIT}
          </dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            수수료 <span>Fee</span>
          </dt>
          <dd>
            {CryptoUtils.getPriceText(history.fee)}
            {CRYPTO_WALLET_UNIT}
          </dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            실현손익 <span>Realized Profit</span>
          </dt>
          <dd>
            {CryptoUtils.getPriceText(history.pnl)}
            {CRYPTO_WALLET_UNIT}
          </dd>
        </S.OrderItem>
      </S.OrderBody>
    </S.OrderBox>
  );
};
