'use client';

import useIsScrollTop from '@/hooks/useIsScrollTop';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import * as S from '@/styles/CryptoMarketStyles';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import { PriceChangeTypes } from '@/types/cryptos/CryptoTypes';
import CryptoUtils from '@/utils/CryptoUtils';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  marketCode: string;
  marketData: object;
  marketCurrent: IUpbitMarketTicker;
  isShowPriceInfo?: boolean;
}
export default function CryptoMarketInfo({ marketCode, marketData, marketCurrent, isShowPriceInfo = true }: Props) {
  // 현재 시장 정보
  const imageCode = marketCode.split('-')[1];
  const currency = marketCode.split('-')[0];

  const socketData = useMarketPriceStore((state) => state.marketDic[marketCode]);
  const [market, setMarket] = useState<CryptoMarket>(new CryptoMarket());

  const { changeType, price, changeRate, changePrice } = useMemo(() => {
    if (!socketData) {
      return {
        changeType: PriceChangeTypes.EVEN,
        price: marketCurrent.trade_price,
        changeRate: market.changeRate,
        changePrice: market.changePrice,
      };
    }
    return {
      changeType: CryptoUtils.getPriceChangeType(socketData.trade_price, socketData.opening_price),
      price: socketData.trade_price,
      changeRate: socketData.signed_change_rate,
      changePrice: socketData.signed_change_price,
    };
  }, [socketData]);

  const [priceWidth, setPriceWidth] = useState<number>(0);

  // 디자인 관련
  const isScrollTop = useIsScrollTop();

  useEffect(() => {
    const _market = new CryptoMarket();
    _market.parseResponse(marketData);

    setMarket(_market);
  }, [marketData]);

  useEffect(() => {
    setPriceWidth(CryptoUtils.getPriceTextLength(price) * 15 + 30);
  }, [price]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <S.TitleLayout
      $is_active={!isScrollTop}
      onClick={() => {
        handleScrollTop();
      }}
    >
      <div className="flex flex-col gap-1">
        {/* 코인 이름 */}
        <S.MainTitleBox>
          <div className="p-1 bg-slate-200 rounded-lg">
            <div className="relative flex flex-cetner max-md:w-6 md:w-7 aspect-square">
              <img
                src={`https://static.upbit.com/logos/${imageCode}.png`}
                alt="coin"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="max-md:text-xl md:text-3xl text-slate-50 font-semibold">{market.koreanName}</h1>
          <div className="flex flex-col justify-center">
            <span className="max-md:text-xs md:text-sm text-slate-400 max-md:leading-4 md:leading-3">
              {market.englishName}
            </span>
            <span className="max-md:text-[8px] md:text-[10px] text-slate-500 max-md:leading-2 md:leading-4">
              {market.code}
            </span>
          </div>
        </S.MainTitleBox>

        {/* 코인 가격 */}
        <S.MainPriceBox
          className={`${
            changeType === PriceChangeTypes.RISE ? 'rise' : changeType === PriceChangeTypes.FALL ? 'fall' : ''
          } change`}
        >
          {/* tailwind 변수 테스트 */}
          <span className={'price'}>
            {/* <CountUp start={startPrice} end={price} duration={0.3} separator="," />  */}
            {CryptoUtils.getPriceText(price)}
            <span className="currency">{currency}</span>
          </span>

          <div className="change">
            <span className="rate">{(changeRate * 100).toFixed(2)}%</span>
            <span className="price">
              {CryptoUtils.getPriceText(changePrice)}
              <span className="currency">{currency}</span>
            </span>
          </div>
        </S.MainPriceBox>
      </div>

      {isShowPriceInfo && (
        <div className="max-md:hidden md:flex flex-col pt-4 max-md:ml-auto">
          <S.MainPriceInfoGrid>
            <div>
              <dl>
                <dt className="label w-8">고가</dt>
                <dd className="value w-24 rise">{CryptoUtils.getPriceText(marketCurrent.high_price)}</dd>
              </dl>
              <dl>
                <dt className="label w-8">저가</dt>
                <dd className="value w-24 fall">{CryptoUtils.getPriceText(marketCurrent.low_price)}</dd>
              </dl>
            </div>
            <div>
              <dl>
                <dt className="label w-20">거래량(24h)</dt>
                <dd className="value w-28 text-xs">{CryptoUtils.getPriceText(marketCurrent.acc_trade_volume_24h)}</dd>
              </dl>
              <dl>
                <dt className="label w-20">거래대금(24h)</dt>
                <dd className="value w-28 text-xs">{CryptoUtils.getPriceText(marketCurrent.acc_trade_price_24h)}</dd>
              </dl>
            </div>
          </S.MainPriceInfoGrid>
        </div>
      )}
    </S.TitleLayout>
  );
}
