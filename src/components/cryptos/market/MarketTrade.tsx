'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import * as I from '@/components/inputs/TradeInputs';
import { useCryptoMarketTrade } from '@/hooks/useCryptoMarketTrade';
import { useUser } from '@/hooks/useUser';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import useToastMessageStore from '@/store/useToastMessageStore';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoTradeStyles';
import { TextFormats } from '@/types/CommonTypes';
import { CryptoFee, MAX_COST_RATIO } from '@/types/cryptos/CryptoConsts';
import {
  type MarginModeType,
  MarginModeTypes,
  type PositionType,
  PositionTypes,
  type SizeUnitType,
  type TradeOrderType,
  TradeOrderTypes,
  TradeTypes,
} from '@/types/cryptos/CryptoTypes';
import type User from '@/types/users/User';
import CommonUtils from '@/utils/CommonUtils';
import CryptoUtils from '@/utils/CryptoUtils';
import TypeUtils from '@/utils/TypeUtils';
import { useEffect, useState } from 'react';

const R = 0.005; // 유지 증거금률

interface ICryptoMarketTrade {
  user: User;
  marketCode: string;
  unit: string;
  sizeUnitType: SizeUnitType;
  setSizeUnitType: (type: SizeUnitType) => void;
}
export default function CryptoMarketTrade({
  user,
  marketCode,
  unit,
  sizeUnitType,
  setSizeUnitType,
}: ICryptoMarketTrade) {
  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  const { isAuth } = useUser();
  const { balance, locked, updateInfo, myTrades } = useUserInfoStore();
  const userBudget = balance - locked;
  const maxCost = userBudget * MAX_COST_RATIO;

  const socketData = useMarketPriceStore((state) => state.marketDic[marketCode]);
  const marketPrice = socketData ? socketData.trade_price : 0;

  const { tradePrice: price, setTradePrice: setPrice } = useCryptoMarketTrade();
  const [isMarginModeDisabled, setMarginModeDisabled] = useState<boolean>(false);
  const [marginMode, setMarginMode] = useState<MarginModeType>(MarginModeTypes.CROSSED); // 마진모드 (CROSSED, ISOLATED)
  const [leverageRatio, setLeverageRatio] = useState<number>(1); // 레버리지 비율
  const [orderType, setOrderType] = useState<TradeOrderType>(TradeOrderTypes.LIMIT); // 지정가/시장가
  const [quantity, setQuantity] = useState<number>(0); // 구매 수량
  const [cost, setCost] = useState<number>(0); // 구매 비용
  const [size, setSize] = useState<number>(0); // 레버리지 포함 크기
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [fee, setFee] = useState<number>(CryptoFee.MAKER); // 구매 수수료

  const [liqLongPrice, setLiqLongPrice] = useState<number>(0); // 청산가 (롱)
  const [liqShortPrice, setLiqShortPrice] = useState<number>(0); // 청산가 (숏)

  useEffect(() => {
    initPrice();
  }, [marketCode, user.uuid]);

  useEffect(() => {
    // 이미 포지션이 있으면 해당 포지션으로 고정
    const position = myTrades.positions.find((position) => position.market.code === marketCode);
    if (position) {
      setMarginMode(position.marginMode);
      setMarginModeDisabled(true);
    } else {
      setMarginModeDisabled(false);
    }
  }, [marketCode, myTrades.positions]);

  useEffect(() => {
    setLiqLongPrice(price * (1 - 1 / leverageRatio) + R);
    setLiqShortPrice(price * (1 + 1 / leverageRatio) - R);
  }, [price, leverageRatio]);

  useEffect(() => {
    setSize(cost * leverageRatio);
  }, [leverageRatio]);

  useEffect(() => {
    if (orderType === TradeOrderTypes.MARKET) {
      setPrice(marketPrice);
      setFee(CryptoFee.TAKER);
    } else if (orderType === TradeOrderTypes.LIMIT) {
      setFee(CryptoFee.MAKER);
    }
  }, [orderType, marketPrice]);

  const initPrice = () => {
    setPrice(marketPrice);
  };

  const handleTrade = async (_positionType: PositionType) => {
    if (!isAuth) {
      createToastMessage('로그인이 필요합니다.');
      return;
    }

    const errorMessages: Array<string> = [];
    if (cost <= 0) {
      errorMessages.push('거래수량을 입력해주세요.');
    }
    if (price <= 0) {
      errorMessages.push('거래 가격을 입력해주세요.');
    }
    if (leverageRatio <= 0) {
      errorMessages.push('레버리지를 입력해주세요.');
    }
    if (cost > maxCost) {
      errorMessages.push('잔액이 부족합니다.');
    }
    if (errorMessages.length > 0) {
      alert(errorMessages.join('\n'));
      return;
    }

    const data = {
      market_code: marketCode,
      trade_type: TradeTypes.OPEN,
      margin_mode: marginMode,
      position_type: _positionType,
      cost: cost,
      price: price,
      quantity: quantity,
      size: size,
      leverage: leverageRatio,
      size_unit_type: sizeUnitType,
    };

    let result = false;
    if (orderType === TradeOrderTypes.LIMIT) {
      result = await CryptoApi.orderLimit(data);
    } else if (orderType === TradeOrderTypes.MARKET) {
      result = await CryptoApi.orderMarket(data);
    }

    if (result) {
      createToastMessage('거래가 성공적으로 완료되었습니다.');
      updateInfo();
    } else {
      createToastMessage('거래에 실패하였습니다.');
    }
  };

  return (
    <S.TradeBox>
      <I.MarginModeInput marginMode={marginMode} setMarginMode={setMarginMode} disabled={isMarginModeDisabled} />

      <I.LeverageInput leverageRatio={leverageRatio} setLeverageRatio={setLeverageRatio} maxRatio={75} />
      <div className="mt-2! mb-2! border-b border-slate-600/30" />
      <I.OrderTypeInput orderType={orderType} setOrderType={setOrderType} />

      {orderType === TradeOrderTypes.LIMIT && (
        <>
          <I.LimitPriceInput price={price} setPrice={setPrice} initPrice={initPrice} />
          <I.TradeSizeInput
            orderType={orderType}
            size={size}
            setQuantity={setQuantity}
            setSize={setSize}
            maxSize={maxCost}
            setCost={setCost}
            leverage={leverageRatio}
            price={price}
            fee={fee}
            unit={unit}
            sizeUnitType={sizeUnitType}
            setSizeUnitType={setSizeUnitType}
          />
        </>
      )}

      {orderType === TradeOrderTypes.MARKET && (
        <I.TradeSizeInput
          orderType={orderType}
          size={size}
          setQuantity={setQuantity}
          setSize={setSize}
          maxSize={maxCost}
          setCost={setCost}
          leverage={leverageRatio}
          price={price}
          fee={fee}
          unit={unit}
          sizeUnitType={sizeUnitType}
          setSizeUnitType={setSizeUnitType}
        />
      )}

      <I.TpSlLayout>
        <I.NumberInput label={'TP'} value={takeProfit} setValue={setTakeProfit} />
        <I.NumberInput label={'SL'} value={stopLoss} setValue={setStopLoss} />
      </I.TpSlLayout>

      <div className="flex flex-col w-full space-y-1 mt-auto!">
        <S.SummaryItem>
          <span className="label">현재 지갑 잔액</span>
          <span className="value">{CryptoUtils.getPriceText(userBudget)}</span>
        </S.SummaryItem>
        <S.SummaryItem>
          <span className="label">구매 비용</span>
          <span className="value">{CryptoUtils.getPriceText(cost)}</span>
        </S.SummaryItem>
        {marginMode === MarginModeTypes.ISOLATED && (
          <>
            <S.SummaryItem>
              <span className="label">청산가 (롱)</span>
              <span className="value">{CommonUtils.textFormat(liqLongPrice, TextFormats.NUMBER)}</span>
            </S.SummaryItem>
            <S.SummaryItem>
              <span className="label">청산가 (숏)</span>
              <span className="value">{CommonUtils.textFormat(liqShortPrice, TextFormats.NUMBER)}</span>
            </S.SummaryItem>
          </>
        )}
        <S.SummaryItem>
          <span className="label">수수료</span>
          <span className="value">{TypeUtils.percent(fee, 3)}</span>
        </S.SummaryItem>
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        <S.TradeLongButton
          onClick={() => {
            handleTrade(PositionTypes.LONG);
          }}
        >
          매수/롱
        </S.TradeLongButton>
        <S.TradeShortButton
          onClick={() => {
            handleTrade(PositionTypes.SHORT);
          }}
        >
          매도/숏
        </S.TradeShortButton>
      </div>
    </S.TradeBox>
  );
}
