'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import * as S from '@/styles/CryptoMarketStyles';
import { type OrderType, OrderTypes } from '@/types/common/CommonTypes';
import type CryptoMarket from '@/types/cryptos/CryptoMarket';
import { type MarketSortType, MarketSortTypes, type MarketType, MarketTypes } from '@/types/cryptos/CryptoTypes';
import { getChoseong } from 'es-hangul';
import { Suspense, useCallback, useEffect, useState } from 'react';
import Market from './Market';
import MarketSortTypeButton from './MarketSortTypeButton';

const getSortedCodes = async (
  marketDic: Record<string, CryptoMarket>,
  sortType: MarketSortType,
  orderType: OrderType,
): Promise<string[]> => {
  const currentMarketData = await TradeGoApi.getMarketsCurrentDic();

  return Object.keys(marketDic).sort((a, b) => {
    let valueA: string | number = 0;
    let valueB: string | number = 0;

    if (sortType === MarketSortTypes.NAME) {
      valueA = marketDic[a].koreanName;
      valueB = marketDic[b].koreanName;
    } else if (sortType === MarketSortTypes.PRICE) {
      valueA = currentMarketData[a]?.trade_price || 0;
      valueB = currentMarketData[b]?.trade_price || 0;
    } else if (sortType === MarketSortTypes.CHANGE) {
      valueA = currentMarketData[a]?.signed_change_rate || 0;
      valueB = currentMarketData[b]?.signed_change_rate || 0;
    } else if (sortType === MarketSortTypes.TRADE_PRICE) {
      valueA = currentMarketData[a]?.acc_trade_price_24h || 0;
      valueB = currentMarketData[b]?.acc_trade_price_24h || 0;
    }

    if (valueA < valueB) {
      return orderType === OrderTypes.ASC ? -1 : 1;
    }
    if (valueA > valueB) {
      return orderType === OrderTypes.ASC ? 1 : -1;
    }
    return 0;
  });
};

const getFilteredMarkets = (_search: string, _markets: Array<CryptoMarket>): Set<string> => {
  if (_search === '') {
    return new Set<string>(_markets.map((market) => market.code));
  }

  const keys = new Set<string>();
  _markets
    .filter((market) => {
      const koreanChoseong = getChoseong(market.koreanName);
      const searchChoseong = getChoseong(_search);
      return (
        (koreanChoseong && searchChoseong && koreanChoseong.includes(searchChoseong)) ||
        market.englishName.includes(_search) ||
        market.code.includes(_search.toUpperCase())
      );
    })
    .map((market) => {
      keys.add(market.code);
    });

  return keys;
};

export default function CryptoMarketList() {
  const [search, setSearch] = useState<string>(''); // 검색어

  const [sortType, setSortType] = useState<MarketSortType>(MarketSortTypes.TRADE_PRICE); // 정렬 기준
  const [orderType, setOrderType] = useState<OrderType>(OrderTypes.DESC); // 정렬 방식

  return (
    <S.MarketListBox>
      <input type="text" value={search} placeholder="코인 검색" onChange={(e) => setSearch(e.target.value)} />

      <div className="market-sort">
        <Suspense>
          <MarketSortTypeButton
            sortType={MarketSortTypes.NAME}
            currentSortType={sortType}
            setSortType={setSortType}
            currentOrderType={orderType}
            setOrderType={setOrderType}
          />
          <MarketSortTypeButton
            sortType={MarketSortTypes.PRICE}
            currentSortType={sortType}
            setSortType={setSortType}
            currentOrderType={orderType}
            setOrderType={setOrderType}
          />
          <MarketSortTypeButton
            sortType={MarketSortTypes.CHANGE}
            currentSortType={sortType}
            setSortType={setSortType}
            currentOrderType={orderType}
            setOrderType={setOrderType}
          />
          <MarketSortTypeButton
            sortType={MarketSortTypes.TRADE_PRICE}
            currentSortType={sortType}
            setSortType={setSortType}
            currentOrderType={orderType}
            setOrderType={setOrderType}
          />
        </Suspense>
      </div>

      <List search={search} sortType={sortType} orderType={orderType} />
    </S.MarketListBox>
  );
}

const List = ({ search, sortType, orderType }: { search: string; sortType: MarketSortType; orderType: OrderType }) => {
  const [marketDic, setMarketDic] = useState<Record<string, CryptoMarket>>({}); // 코인 목록
  const [marketFilteredCodeSet, setMarketFilteredCodeSet] = useState<Set<string>>(new Set<string>()); // 검색한 코인 목록
  const [marketType, _setMarketType] = useState<MarketType>(MarketTypes.KRW); // 마켓 종류 (KRW, BTC, USDT, HOLD)
  const [sortedCodes, setSortedCodes] = useState<string[]>(['KRW-BTC']); // 정렬된 코드

  useEffect(() => {
    getMarkets(search, marketType);
  }, [marketType]);

  useEffect(() => {
    const filteredSet = getFilteredMarkets(search, Object.values({ ...marketDic }));
    setMarketFilteredCodeSet(filteredSet);
  }, [search]);

  useEffect(() => {
    (async () => {
      const _sortedCodes = await getSortedCodes({ ...marketDic }, sortType, orderType);
      setSortedCodes(_sortedCodes);
    })();
  }, [marketDic, orderType, sortType]);

  const getMarkets = useCallback(
    async (_search: string, marketType: MarketType) => {
      // 마켓타입에 따른 모든 코인 목록을 가져온다
      const response = await CryptoApi.getMarkets('', marketType);
      setMarketDic(
        response.reduce(
          (acc, market) => {
            acc[market.code] = market;
            return acc;
          },
          {} as Record<string, CryptoMarket>,
        ),
      );

      // 검색어에 따른 코인 목록을 가져온다
      const filteredSet = getFilteredMarkets(_search, response);
      setMarketFilteredCodeSet(filteredSet);
    },
    [setMarketDic, setMarketFilteredCodeSet],
  );

  return (
    <div className="list scroll-transparent">
      {sortedCodes
        .filter((code) => marketFilteredCodeSet.has(code))
        .map((marketCode) => (
          <Market key={marketCode} market={marketDic[marketCode]} />
        ))}
    </div>
  );
};

// interface IMarketType {
//   marketType: MarketType
//   currentMarketType: MarketType
//   setMarketType: (marketType: MarketType) => void
// }
// const MarketType = ({ marketType, currentMarketType, setMarketType }: IMarketType) => {
//   return (
//     <button className={marketType === currentMarketType ? 'active' : ''} type="button" onClick={() => setMarketType(marketType)}>
//       {MarketTypeNames[marketType]}
//     </button>
//   )
// }
