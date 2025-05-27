import { useCryptoUi } from '@/hooks/useCryptoUi';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import * as S from '@/styles/CryptoMarketStyles';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import { PriceChangeTypes } from '@/types/cryptos/CryptoTypes';
import CryptoUtils from '@/utils/CryptoUtils';
import { memo, useEffect, useState } from 'react';

interface Props {
  market: CryptoMarket;
}
export default memo(function Market({ market }: Props) {
  const socketData = useMarketPriceStore((state) => state.marketDic[market.code]);
  const [isPriceChangeShow, setIsPriceChangeShow] = useState<boolean>(false);

  const { setIsShowMarketList } = useCryptoUi();

  useEffect(() => {
    setIsPriceChangeShow(market.code.includes('KRW-'));
  }, [market]);

  if (!socketData || socketData.trade_price < 0) return null;

  const changeType = CryptoUtils.getPriceChangeType(socketData.trade_price, socketData.opening_price);
  // const openingPrice = socketData.opening_price
  const price = socketData.trade_price;
  // const startPrice = socketData.trade_price
  const tradePrice24 = socketData.acc_trade_price_24h || 0;
  const changeRate = socketData.signed_change_rate;
  const changePrice = socketData.signed_change_price;
  const changeRateText = !isNaN(changeRate) ? `${(changeRate * 100).toFixed(2)}%` : '-';

  return (
    <S.MarketListItem
      href={`/crypto/${market.code}`}
      id={`market-list-${market.code}`}
      className={`${
        changeType === PriceChangeTypes.RISE ? 'rise' : changeType === PriceChangeTypes.FALL ? 'fall' : ''
      }`}
      onClick={() => setIsShowMarketList(false)}
    >
      <div className="name">
        <span className="korean">{market.koreanName}</span>
        <span className="english">{market.code}</span>
      </div>
      <div className="price change-color">
        <span className="price">
          {/* <CountUp start={startPrice} end={price} duration={0.3} separator="," /> */}
          {CryptoUtils.getPriceText(price)}
        </span>
        <span className="volume" title="거래대금 (24h)">
          {CryptoUtils.getTradePriceText(tradePrice24)}
        </span>
      </div>
      <div className="change change-color">
        <span className="rate" title="전일 대비 변화액">
          {changeRateText}
        </span>
        {isPriceChangeShow && (
          <span className="price" title="전일 대비 변화율">
            {CryptoUtils.getPriceText(changePrice)}
          </span>
        )}
      </div>
    </S.MarketListItem>
  );
});
