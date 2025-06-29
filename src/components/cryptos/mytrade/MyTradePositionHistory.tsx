'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import { CRYPTO_WALLET_UNIT } from '@/constants/CryptoConsts';
import usePageScroll from '@/hooks/usePageScroll';
import * as S from '@/styles/CryptoMyTradeStyles';
import { MarginModeTypeNames, PositionTypes } from '@/types/cryptos/CryptoTypes';
import type TradePosition from '@/types/cryptos/TradePosition';
import CryptoUtils from '@/utils/CryptoUtils';
import dayjs from 'dayjs';
import { useState } from 'react';
import CryptoMyTradeFilter from './Filter';
import HeaderLink from './HeaderLink';
import CryptoMyTradeItemSkeleton from './ItemSkeleton';
import MyTradeBlank from './MyTradeBlank';
import useSystemMessageStore from '@/store/useSystemMessageStore';
import TypeUtils from '@/utils/TypeUtils';

const PAGE_SIZE = 10;

export default function CryptoMyTradePositionHistory() {
  const [positions, setPositions] = useState<Array<TradePosition>>([]);
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
    const response = await CryptoApi.getTradePositionHistories(_pageIndex, 50, dateStart, dateEnd);

    if (_pageIndex === 1) {
      setPositions(response.items);
    } else {
      setPositions([...positions, ...response.items]);
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

      <S.PageList $is_active={positions.length > 0}>
        {positions.map((position, index) => (
          <Position key={index} position={position} />
        ))}

        <CryptoMyTradeItemSkeleton ref={scrollRef} pageIndex={pageIndex} itemCount={itemCount} pageSize={PAGE_SIZE} />
      </S.PageList>
      <MyTradeBlank isShow={positions.length === 0} message="포지션 내역이 없습니다." />
    </S.PageLayout>
  );
}

interface IPosition {
  position: TradePosition;
}
const Position = ({ position }: IPosition) => {
  const createSystemMessage = useSystemMessageStore((state) => state.createMessage);

  const handleFlex = async () => {
    const result = await createSystemMessage({
      type: 'confirm',
      content: '수익인증 하시겠습니까?',
    });
    if (!result) {
      return;
    }

    const [flex, statusCode] = await CryptoApi.createFlex(position.id);
    if (statusCode === 201) {
      createSystemMessage({
        type: 'alert',
        content: '업로드 되었습니다.',
      });
    } else if (statusCode === 409) {
      createSystemMessage({
        type: 'alert',
        content: '이미 수익인증 되었습니다.',
      });
    } else {
      createSystemMessage({
        type: 'alert',
        content: '업로드 실패하였습니다.',
      });
    }
  };

  return (
    <S.OrderBox>
      <S.OrderHeader>
        <div className="sm:!hidden datetime">
          <i className="fa-solid fa-clock"></i>
          <span>{dayjs(position.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
        </div>

        <div className="row">
          <div className="section">
            <div className="max-sm:!hidden datetime">
              <i className="fa-solid fa-clock"></i>
              <span>{dayjs(position.createdDate).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>

            <div className={`position ${position.positionType === PositionTypes.LONG ? 'long' : 'short'}`}>
              {position.positionType === PositionTypes.LONG ? 'LONG' : 'SHORT'}
            </div>

            <HeaderLink href={`/crypto/${position.market.code}`} className="title">
              <span className="korean">{position.market.koreanName}</span>
              <span className="code">{position.market.code}</span>
            </HeaderLink>
          </div>

          <div className="section">
            <div className="info">{MarginModeTypeNames[position.marginMode]}</div>
            <button type="button" className="info" onClick={handleFlex}>
              수익인증
            </button>
          </div>
        </div>
      </S.OrderHeader>

      <S.OrderBody>
        <S.OrderItem className={''}>
          <dt>
            진입 가격 <span>Entry Price</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(position.entryPrice)}</dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            평균 종료 가격 <span>Avg. Close Price</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(position.averageClosePrice)}</dd>
        </S.OrderItem>
        <S.OrderItem className={`max-sm:hidden col-span-2 ${(position.pnl - position.totalFee) > 0 ? 'long' : 'short'}`}>
          <dt>
            손익 <span>Closing PNL</span>
          </dt>
          <dd className="!font-medium">
            {CryptoUtils.getPriceText(position.pnl - position.totalFee)}
            {CRYPTO_WALLET_UNIT}
            /
            {TypeUtils.percent(position.pnlRatio, 2)}
          </dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            시작 일시 <span>Opened</span>
          </dt>
          <dd>{dayjs(position.entryTime).format('YYYY-MM-DD HH:mm:ss')}</dd>
        </S.OrderItem>
        <S.OrderItem className={''}>
          <dt>
            종료 일시 <span>Closed</span>
          </dt>
          <dd>{dayjs(position.closeTime).format('YYYY-MM-DD HH:mm:ss')}</dd>
        </S.OrderItem>
        <S.OrderItem className={`sm:hidden col-span-2 ${(position.pnl - position.totalFee) > 0 ? 'long' : 'short'}`}>
          <dt>
            손익 <span>Closing PNL</span>
          </dt>
          <dd className="!font-medium">
            {CryptoUtils.getPriceText(position.pnl)}
            {CRYPTO_WALLET_UNIT}
            /
            {TypeUtils.percent(position.pnl / position.entryPrice, 2)}
          </dd>
        </S.OrderItem>
      </S.OrderBody>
    </S.OrderBox>
  );
};
