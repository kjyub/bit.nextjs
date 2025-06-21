'use client';
import { useUser } from '@/hooks/useUser';
import { CryptoMarketTradeProvider } from '@/store/providers/CryptoMarketTradeProvider';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoMarketStyles';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import { type SizeUnitType, SizeUnitTypes } from '@/types/cryptos/CryptoTypes';
// import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CryptoMyTrade from '../mytrade/MyTradeMain';
import CryptoMarketChart from './MarketChart';
import CryptoMarketInfo from './MarketInfo';
import CryptoMarketMobileChart from './MarketMobileChart';
import CryptoMarketOrderBook from './MarketOrderBook';
import CryptoMarketTrade from './MarketTrade';

// const CryptoMarketMobileChart = dynamic(() => import('./MarketMobileChart'), { ssr: false });

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
  const [sizeUnitType, setSizeUnitType] = useState<SizeUnitType>(SizeUnitTypes.PRICE); // 단위 타입
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
          <CryptoMarketTradeProvider marketCode={marketCode}>
            <S.ChartLayout>
              <CryptoMarketChart marketCode={marketCode} />
              <CryptoMarketMobileChart marketCode={marketCode} />
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
          </CryptoMarketTradeProvider>
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
