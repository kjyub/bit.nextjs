'use client';
import { useUser } from '@/hooks/useUser';
import { CryptoMarketTradeProvider } from '@/store/providers/CryptoMarketTradeProvider';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoMarketStyles';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import { type SizeUnitType, SizeUnitTypes } from '@/types/cryptos/CryptoTypes';
import User from '@/types/users/User';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import CryptoMarketCommunity from '../community/Community';
import CryptoMyTrade from '../mytrade/MyTradeMain';
import CryptoMarketChart from './MarketChart';
import CryptoMarketInfo from './MarketInfo';
import CryptoMarketOrderBook from './MarketOrderBook';
import CryptoMarketTrade from './MarketTrade';

export default function CryptoMarketLoading() {
  return (
    <S.MarketLayout>
      {/* <CryptoMarketInfo marketCode={marketCode} marketData={marketData} marketCurrent={marketCurrent} /> */}
      <S.TitleLayout>
        <div className="flex flex-col gap-1">
          {/* 코인 이름 */}
          <S.MainTitleBox>
            <div className="p-1 bg-slate-500/50 rounded-lg animate-pulse">
              <div className="max-md:w-6 md:w-7 aspect-square"></div>
            </div>
            <h1 className="max-md:text-xl md:text-3xl text-slate-50 font-semibold skeleton w-32">이름</h1>
          </S.MainTitleBox>

          {/* 코인 가격 */}
          <S.MainPriceBox>
            <div className="change skeleton w-84">변동률</div>
          </S.MainPriceBox>
        </div>

        <div className="max-md:hidden md:flex flex-col pt-4 max-md:ml-auto">
          <S.MainPriceInfoGrid>
            <div>
              <dl>
                <dd className="value w-32 rise skeleton h-4"></dd>
              </dl>
              <dl>
                <dd className="value w-32 fall skeleton h-4"></dd>
              </dl>
            </div>
            <div>
              <dl>
                <dd className="value w-36 text-xs skeleton h-4"></dd>
              </dl>
              <dl>
                <dd className="value w-36 text-xs skeleton h-4"></dd>
              </dl>
            </div>
          </S.MainPriceInfoGrid>
        </div>
      </S.TitleLayout>

      {/* 코인 정보 */}
      <S.MainLayout>
        <S.ChartAndTradeLayout>
          <CryptoMarketTradeProvider>
            <S.ChartLayout className="skeleton bg-transparent">
              {/* <CryptoMarketChart marketCode={marketCode} />
              <CryptoMarketMobileChart marketCode={marketCode} /> */}
            </S.ChartLayout>

            <S.OrderBookLayout className="skeleton bg-transparent">
              {/* <CryptoMarketOrderBook marketCode={marketCode} marketCurrent={marketCurrent} /> */}
            </S.OrderBookLayout>

            <S.TradeLayout>
              <CryptoMarketTrade
                user={new User()}
                marketCode={'KRW-BTC'}
                unit={'BTC'}
                sizeUnitType={SizeUnitTypes.PRICE}
                setSizeUnitType={() => {}}
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
        <S.CommunityLayout>
          <CryptoMarketCommunity
            marketCode={'KRW-BTC'}
            searchParams={{ search: '', page: 1 }}
            communityListData={{}}
            isLoading={true}
          />
        </S.CommunityLayout>
      </S.BottomLayout>
    </S.MarketLayout>
  );
}
