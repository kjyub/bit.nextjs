'use client';
import { useUser } from '@/hooks/useUser';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoMarketStyles';
import { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import { SizeUnitTypes } from '@/types/cryptos/CryptoTypes';
import { useEffect, useState } from 'react';
import CryptoMarketInfo from './CryptoMarketInfo';
import CryptoMarketTrade from './CryptoMarketTrade';
import CryptoMarketChart from './CryptoMarketChart';
import CryptoMyTrade from '../mytrade/CryptoMyTradeMain';
import CryptoMarketOrderBook from './CryptoMarketOrderBook';

interface ICryptoMarket {
  marketCode: string;
  marketData: object;
  marketCurrent: IUpbitMarketTicker;
  communityNode: React.ReactNode;
}
export default function CryptoMarketMain({ marketCode, marketData, marketCurrent, communityNode }: ICryptoMarket) {
  const { user } = useUser();
  const { updateInfo } = useUserInfoStore();

  useEffect(() => {
    updateInfo();
  }, [marketCode]);

  // 설정 정보
  const [sizeUnitType, setSizeUnitType] = useState<SizeUnitTypes>(SizeUnitTypes.PRICE); // 단위 타입
  const imageCode = marketCode.split('-')[1];

  if (Object.keys(marketCurrent).length === 0) {
    return;
  }

  return (
    <S.MarketLayout>
      <CryptoMarketInfo marketCode={marketCode} marketData={marketData} marketCurrent={marketCurrent} />

      {/* 코인 정보 */}
      <S.MainLayout>
        <S.ChartAndTradeLayout>
          <S.ChartLayout>
            <CryptoMarketChart marketCode={marketCode} />
          </S.ChartLayout>

          <S.OrderBookLayout>
            <CryptoMarketOrderBook marketCode={marketCode} marketCurrent={marketCurrent} />
          </S.OrderBookLayout>

          <S.TradeLayout>
            <CryptoMarketTrade
              user={user}
              marketCode={marketCode}
              unit={imageCode}
              sizeUnitType={sizeUnitType}
              setSizeUnitType={setSizeUnitType}
            />
          </S.TradeLayout>
        </S.ChartAndTradeLayout>
      </S.MainLayout>

      {/* 커뮤니티 */}
      <S.BottomLayout>
        <S.MyTradeLayout>
          <CryptoMyTrade />
        </S.MyTradeLayout>
        <S.CommunityLayout>{communityNode}</S.CommunityLayout>
      </S.BottomLayout>
    </S.MarketLayout>
  );
}
