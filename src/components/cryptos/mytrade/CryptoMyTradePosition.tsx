'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import * as I from '@/components/inputs/TradeInputs';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoMyTradeStyles';
import {
  MarginModeType,
  MarginModeTypeNames,
  PositionType,
  SizeUnitTypes,
  TradeOrderType,
  type TradeOrderTypeValues,
  TradeType,
} from '@/types/cryptos/CryptoTypes';
import type TradePosition from '@/types/cryptos/TradePosition';
import CommonUtils from '@/utils/CommonUtils';
import CryptoUtils from '@/utils/CryptoUtils';
import TypeUtils from '@/utils/TypeUtils';
import { useCallback, useEffect, useState } from 'react';

export default function CryptoMyTradePosition() {
  const { balance, myTrades } = useUserInfoStore();
  const positions = myTrades.positions;

  return (
    <S.PageLayout className="p-2 space-y-2">
      <S.PageList $is_active={positions.length > 0}>
        {positions.map((position, index) => (
          <Position key={index} position={position} userBudget={balance} />
        ))}
      </S.PageList>
    </S.PageLayout>
  );
}

interface IPosition {
  position: TradePosition;
  userBudget: number;
}
const Position = ({ position, userBudget }: IPosition) => {
  const socketData = useMarketPriceStore((state) => state.marketDic[position.market.code]);
  const marketPrice = socketData ? socketData.trade_price : 0;

  const [bep, setBep] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [marginRatio, setMarginRatio] = useState<number>(0);
  const [pnl, setPnl] = useState<number>(0);
  const [pnlRatio, setPnlRatio] = useState<number>(0);

  const [closePrice, setClosePrice] = useState<number>(0);
  const [closeQuantity, setCloseQuantity] = useState<number>(position.quantity);

  useEffect(() => {
    setCloseQuantity(position.quantity);
  }, [position]);

  useEffect(() => {
    setClosePrice(marketPrice);

    const _size = position.quantity * marketPrice;
    setSize(_size);

    const breakEvenPrice = position.totalFee / position.quantity;
    setBep(
      position.averagePrice +
        CryptoUtils.getPriceRound(breakEvenPrice) * (position.positionType === PositionType.LONG ? 1 : -1),
    );
    const _pnl =
      CryptoUtils.getPnl(marketPrice, position.quantity, position.averagePrice, position.positionType) -
      position.totalFee;
    setPnl(_pnl);
    setPnlRatio(_pnl / position.marginPrice);
    if (_pnl < 0) {
      if (position.marginMode === MarginModeType.CROSSED) {
        const margin = position.marginPrice + userBudget;
        setMarginRatio(Math.abs(_pnl) / margin);
      } else if (position.marginMode === MarginModeType.ISOLATED) {
        setMarginRatio(Math.abs(_pnl) / position.marginPrice);
      }
    }
  }, [position, marketPrice]);

  const orderClose = useCallback(
    async (_orderType: TradeOrderTypeValues) => {
      const data = {
        market_code: position.market.code,
        trade_type: TradeType.CLOSE,
        margin_mode: position.marginMode,
        position_type: position.positionType === PositionType.LONG ? PositionType.SHORT : PositionType.LONG,
        cost: position.cost,
        price: Number(marketPrice),
        quantity: Number(closeQuantity),
        size: Number(closeQuantity) * Number(closePrice),
        leverage: position.averageLeverage,
        size_unit_type: SizeUnitTypes.QUANTITY,
      };

      let result = false;
      if (_orderType === TradeOrderType.LIMIT) {
        data.price = Number(closePrice);
        data.quantity = Number(closeQuantity);
        data.size = Number(closeQuantity) * Number(closePrice);

        result = await CryptoApi.orderLimit(data);
      } else if (_orderType === TradeOrderType.MARKET) {
        data.price = marketPrice;
        data.quantity = Number(closeQuantity);
        data.size = Number(closeQuantity) * marketPrice;

        result = await CryptoApi.orderMarket(data);
      }

      if (result) {
        alert('거래가 성공적으로 완료되었습니다.');
        // updateInfo()
      } else {
        alert('거래에 실패하였습니다.');
      }
    },
    [position, marketPrice, closePrice, closeQuantity],
  );

  return (
    <S.PositionBox>
      <S.PositionHeader>
        <div className="row">
          <div className="section">
            <div className={`position ${position.positionType === PositionType.LONG ? 'long' : 'short'}`}>
              {position.positionType === PositionType.LONG ? 'LONG' : 'SHORT'}
            </div>

            <p className="title max-sm:!hidden">
              <span className="korean">{position.market.koreanName}</span>
              <span className="english">{position.market.englishName}</span>
              <span className="code">{position.market.code}</span>
            </p>
          </div>

          <div className="section">
            <div className="info">{CommonUtils.round(position.averageLeverage, 2)}x</div>
            <div className="info">{MarginModeTypeNames[position.marginMode]}</div>
            <button className="info" type="button">
              TP/SL
            </button>
          </div>
        </div>

        <div className="row sm:!hidden">
          <p className="title">
            <span className="korean">{position.market.koreanName}</span>
            <span className="english">{position.market.englishName}</span>
            <span className="code">{position.market.code}</span>
          </p>
        </div>
      </S.PositionHeader>

      <S.PositionBody>
        <S.PositionItem className={''}>
          <dt>
            진입가격 <span>Entry Price</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(position.averagePrice)}</dd>
        </S.PositionItem>
        <S.PositionItem>
          <dt>
            청산가격 <span>Liq.Price</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(position.liquidatePrice)}</dd>
        </S.PositionItem>
        <S.PositionItem>
          <dt>
            손익분기점 <span>Break Even Price</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(bep)}</dd>
        </S.PositionItem>
        <S.PositionItem className={'[&>dd]:font-medium'}>
          <dt>
            현재가격 <span>Price</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(marketPrice)}</dd>
        </S.PositionItem>

        <S.PositionItem className={`${position.positionType === PositionType.LONG ? 'long' : 'short'}`}>
          <dt>
            포지션 크기 <span>Size</span>
          </dt>
          <dd className="flex flex-col w-full">
            <span className="font-medium">
              {position.positionType === PositionType.SHORT && '-'}
              {CryptoUtils.getPriceText(size)}
              {'TW'}
            </span>
            <span className="text-xs">
              {position.quantity}
              {position.market.unit}
            </span>
          </dd>
        </S.PositionItem>
        <S.PositionItem>
          <dt>
            마진 비율 <span>Margin Ratio</span>
          </dt>
          <dd>{TypeUtils.round(marginRatio * 100, 2)}%</dd>
        </S.PositionItem>
        <S.PositionItem>
          <dt>
            증거금 <span>Margin</span>
          </dt>
          <dd>{CryptoUtils.getPriceText(position.marginPrice)}</dd>
        </S.PositionItem>
        <S.PositionItem className={`[&>dd]:font-medium ${pnl < 0 ? 'short' : 'long'}`}>
          <dt>
            실현손익 <span>PNL</span>
          </dt>
          <dd className="flex flex-col w-full">
            <span>{CryptoUtils.getPriceText(pnl)}</span>
            <span className="text-xs">{TypeUtils.round(pnlRatio * 100, 2)}%</span>
          </dd>
        </S.PositionItem>
      </S.PositionBody>

      <S.PositionClose>
        <div className="flex items-center w-full max-sm:gap-1 sm:gap-3">
          <div className="title">포지션 종료</div>
          <div className="buttons">
            <button
              type="button"
              onClick={() => {
                orderClose(TradeOrderType.LIMIT);
              }}
            >
              지정가
            </button>
            <button
              type="button"
              onClick={() => {
                orderClose(TradeOrderType.MARKET);
              }}
            >
              시장가
            </button>
          </div>
          <div className="inputs max-sm:!hidden">
            <I.NumberInput label={'가격'} value={closePrice} setValue={setClosePrice} />
            <I.PositionCloseSizeInput
              label={'크기'}
              value={closeQuantity}
              setValue={setCloseQuantity}
              max={position.quantity}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-2">
          <I.NumberInput label={'가격'} value={closePrice} setValue={setClosePrice} />
          <I.PositionCloseSizeInput
            label={'크기'}
            value={closeQuantity}
            setValue={setCloseQuantity}
            max={position.quantity}
          />
        </div>
      </S.PositionClose>
    </S.PositionBox>
  );
};
