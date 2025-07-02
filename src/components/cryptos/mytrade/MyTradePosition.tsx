'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import * as I from '@/components/inputs/TradeInputs';
import { CRYPTO_WALLET_UNIT } from '@/constants/CryptoConsts';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import useToastMessageStore from '@/store/useToastMessageStore';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoMyTradeStyles';
import { TextFormats } from '@/types/CommonTypes';
import {
  MarginModeTypeNames,
  MarginModeTypes,
  PositionTypes,
  SizeUnitTypes,
  type TradeOrderType,
  TradeOrderTypes,
  TradeTypes,
} from '@/types/cryptos/CryptoTypes';
import type TradePosition from '@/types/cryptos/TradePosition';
import CommonUtils from '@/utils/CommonUtils';
import CryptoUtils from '@/utils/CryptoUtils';
import TypeUtils from '@/utils/TypeUtils';
import { useCallback, useEffect, useRef, useState } from 'react';
import HeaderLink from './HeaderLink';
import MyTradeBlank from './MyTradeBlank';

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
      <MyTradeBlank isShow={positions.length === 0} message="현재 포지션이 없습니다." />
    </S.PageLayout>
  );
}

interface IPosition {
  position: TradePosition;
  userBudget: number;
}
export const Position = ({ position, userBudget }: IPosition) => {
  const socketData = useMarketPriceStore((state) => state.marketDic[position.market.code]);
  const marketPrice = socketData ? socketData.trade_price : 0;
  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  const [bep, setBep] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [marginRatio, setMarginRatio] = useState<number>(0);
  const [pnl, setPnl] = useState<number>(0);
  const [pnlRatio, setPnlRatio] = useState<number>(0);

  const [closePrice, setClosePrice] = useState<number>(0);
  const [closeQuantity, setCloseQuantity] = useState<number>(position.quantity);

  const isClosePriceFoucsRef = useRef<boolean>(false);

  useEffect(() => {
    setCloseQuantity(position.quantity);
  }, [position]);

  useEffect(() => {
    if (!isClosePriceFoucsRef.current) setClosePrice(marketPrice);

    const _size = position.quantity * marketPrice;
    setSize(_size);

    const breakEvenPrice = position.totalFee / position.quantity;
    setBep(
      position.averagePrice +
        CryptoUtils.getPriceRound(breakEvenPrice) * (position.positionType === PositionTypes.LONG ? 1 : -1),
    );
    const _pnl =
      CryptoUtils.getPnl(marketPrice, position.quantity, position.averagePrice, position.positionType) -
      position.totalFee;
    setPnl(_pnl);
    setPnlRatio(_pnl / position.marginPrice);
    if (_pnl < 0) {
      if (position.marginMode === MarginModeTypes.CROSSED) {
        const margin = position.marginPrice + userBudget;
        setMarginRatio(Math.abs(_pnl) / margin);
      } else if (position.marginMode === MarginModeTypes.ISOLATED) {
        setMarginRatio(Math.abs(_pnl) / position.marginPrice);
      }
    }
  }, [position, marketPrice]);

  const orderClose = useCallback(
    async (_orderType: TradeOrderType) => {
      const data = {
        market_code: position.market.code,
        trade_type: TradeTypes.CLOSE,
        margin_mode: position.marginMode,
        position_type: position.positionType === PositionTypes.LONG ? PositionTypes.SHORT : PositionTypes.LONG,
        price: Number(marketPrice),
        quantity: Number(closeQuantity),
        size: Number(closeQuantity) * Number(closePrice),
        leverage: position.averageLeverage,
        size_unit_type: SizeUnitTypes.QUANTITY,
      };

      let result = false;
      if (_orderType === TradeOrderTypes.LIMIT) {
        data.price = Number(closePrice);
        data.quantity = Number(closeQuantity);
        data.size = Number(closeQuantity) * Number(closePrice);

        result = await CryptoApi.orderLimit(data);
      } else if (_orderType === TradeOrderTypes.MARKET) {
        data.price = marketPrice;
        data.quantity = Number(closeQuantity);
        data.size = Number(closeQuantity) * marketPrice;

        result = await CryptoApi.orderMarket(data);
      }

      if (result) {
        createToastMessage('거래가 성공적으로 완료되었습니다.');
        // updateInfo()
      } else {
        createToastMessage('거래에 실패하였습니다.');
      }
    },
    [position, marketPrice, closePrice, closeQuantity],
  );

  return (
    <S.PositionBox className="@container">
      <S.PositionHeader>
        <div className="row">
          <div className="section">
            <div className={`position ${position.positionType === PositionTypes.LONG ? 'long' : 'short'}`}>
              {position.positionType === PositionTypes.LONG ? 'LONG' : 'SHORT'}
            </div>

            <HeaderLink href={`/crypto/${position.market.code}`} className="title max-sm:!hidden">
              <span className="korean">{position.market.koreanName}</span>
              <span className="english">{position.market.englishName}</span>
              <span className="code">{position.market.code}</span>
            </HeaderLink>
          </div>

          <div className="section">
            <div className="info">{CommonUtils.round(position.averageLeverage, 2)}x</div>
            <div className="info">{MarginModeTypeNames[position.marginMode]}</div>
            {/* <button className="info" type="button">
              TP/SL
            </button> */}
          </div>
        </div>

        <div className="row sm:!hidden">
          <HeaderLink href={`/crypto/${position.market.code}`} className="title">
            <span className="korean">{position.market.koreanName}</span>
            <span className="english">{position.market.englishName}</span>
            <span className="code">{position.market.code}</span>
          </HeaderLink>
        </div>
      </S.PositionHeader>

      <S.PositionBody className="info-box">
        <S.PositionItem>
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

        <S.PositionItem className={`${position.positionType === PositionTypes.LONG ? 'long' : 'short'}`}>
          <dt>
            포지션 크기 <span>Size</span>
          </dt>
          <dd className="flex flex-col w-full">
            <span className="font-medium">
              {position.positionType === PositionTypes.SHORT && '-'}
              {CryptoUtils.getPriceText(size)}
              {CRYPTO_WALLET_UNIT}
            </span>
            <span className="text-xs">
              {CommonUtils.textFormat(TypeUtils.round(position.quantity, 8), TextFormats.NUMBER)}
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
            <span>{pnl > 0 ? '+' : ''}{CryptoUtils.getPriceText(pnl)}</span>
            <span className="text-xs">{TypeUtils.round(pnlRatio * 100, 2)}%</span>
          </dd>
        </S.PositionItem>
      </S.PositionBody>

      <S.PositionClose className="close-box">
        <div className="flex items-center w-full max-sm:gap-1 sm:gap-3">
          <div className="title">포지션 종료</div>
          <div className="buttons">
            <button
              type="button"
              onClick={() => {
                orderClose(TradeOrderTypes.LIMIT);
              }}
            >
              지정가
            </button>
            <button
              type="button"
              onClick={() => {
                orderClose(TradeOrderTypes.MARKET);
              }}
            >
              시장가
            </button>
          </div>
          <div className="inputs max-sm:!hidden">
            <I.NumberInput
              label={'가격'}
              value={closePrice}
              setValue={setClosePrice}
              setFocus={(isFocus) => {
                isClosePriceFoucsRef.current = isFocus;
              }}
            />
            <I.PositionCloseSizeInput
              label={'수량'}
              value={closeQuantity}
              setValue={setCloseQuantity}
              max={position.quantity}
            />
          </div>
        </div>
        <div className="max-sm:grid sm:hidden grid-cols-2 w-full gap-2">
          <I.NumberInput
            label={'가격'}
            value={closePrice}
            setValue={setClosePrice}
            setFocus={(isFocus) => {
              isClosePriceFoucsRef.current = isFocus;
            }}
          />
          <I.PositionCloseSizeInput
            label={'수량'}
            value={closeQuantity}
            setValue={setCloseQuantity}
            max={position.quantity}
          />
        </div>
      </S.PositionClose>
    </S.PositionBox>
  );
};
