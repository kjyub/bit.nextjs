'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import * as S from '@/styles/CryptoMarketStyles';
import { OrderTypeValues, OrderTypes } from '@/types/common/CommonTypes';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import {
  MarketSortTypeNames,
  MarketSortTypeValues,
  MarketSortTypes,
  MarketTypes,
  PriceChangeTypes,
} from '@/types/cryptos/CryptoTypes';
import CryptoUtils from '@/utils/CryptoUtils';
import { useCallback, useEffect, useState } from 'react';

export default function CryptoMarketList() {
  const [marketDic, setMarketDic] = useState<{ [key: string]: CryptoMarket }>({}); // 코인 목록
  const [marketFilteredCodeSet, setMarketFilteredCodeSet] = useState<Set<string>>(new Set<string>()); // 검색한 코인 목록
  const [marketType, _setMarketType] = useState<MarketTypes>(MarketTypes.KRW); // 마켓 종류 (KRW, BTC, USDT, HOLD)
  const [search, setSearch] = useState<string>(''); // 검색어

  const [sortType, setSortType] = useState<MarketSortTypes>(MarketSortTypes.TRADE_PRICE); // 정렬 기준
  const [orderType, setOrderType] = useState<OrderTypeValues>(OrderTypes.DESC); // 정렬 방식
  const [sortedCodes, setSortedCodes] = useState<string[]>([]); // 정렬된 코드

  useEffect(() => {
    getMarkets(search, marketType);
  }, [marketType]);

  useEffect(() => {
    const filteredSet = getFilteredMarkets(search, Object.values(marketDic));
    setMarketFilteredCodeSet(filteredSet);
  }, [search]);

  useEffect(() => {
    setOrderType(OrderTypes.DESC);
  }, [sortType]);

  useEffect(() => {
    const run = async () => {
      const _sortedCodes = await getSortedCodes(sortType, orderType);
      setSortedCodes(_sortedCodes);
    };
    run();
  }, [marketDic, orderType, sortType]);

  const getMarkets = useCallback(
    async (_search: string, marketType: MarketTypes) => {
      // 마켓타입에 따른 모든 코인 목록을 가져온다
      const response = await CryptoApi.getMarkets('', marketType);
      setMarketDic(
        response.reduce((acc, market) => {
          acc[market.code] = market;
          return acc;
        }, {}),
      );

      // 검색어에 따른 코인 목록을 가져온다
      const filteredSet = getFilteredMarkets(_search, response);
      setMarketFilteredCodeSet(filteredSet);
    },
    [setMarketDic, setMarketFilteredCodeSet],
  );

  // 검색 결과 정리
  const getFilteredMarkets = useCallback((_search: string, _markets: Array<CryptoMarket>): Set<string> => {
    const keys = new Set<string>();
    if (_search === '') {
      _markets.map((market) => {
        keys.add(market.code);
      });
    } else {
      _markets
        .filter((market) => {
          return (
            market.koreanName.includes(_search) ||
            market.englishName.includes(_search) ||
            market.code.includes(_search.toUpperCase())
          );
        })
        .map((market) => {
          keys.add(market.code);
        });
    }

    return keys;
  }, []);

  // 코드 정렬하기
  const getSortedCodes = useCallback(
    async (_sortType: MarketSortTypeValues, _orderType: OrderTypeValues): string[] => {
      const currentMarketData = await TradeGoApi.getMarketsCurrentDic();

      return Object.keys(marketDic).sort((a, b) => {
        let valueA: string | number;
        let valueB: string | number;

        if (_sortType === MarketSortTypes.NAME) {
          valueA = marketDic[a].koreanName;
          valueB = marketDic[b].koreanName;
        } else if (_sortType === MarketSortTypes.PRICE) {
          valueA = currentMarketData[a].trade_price;
          valueB = currentMarketData[b].trade_price;
        } else if (_sortType === MarketSortTypes.CHANGE) {
          valueA = currentMarketData[a].signed_change_rate;
          valueB = currentMarketData[b].signed_change_rate;
        } else if (_sortType === MarketSortTypes.TRADE_PRICE) {
          valueA = currentMarketData[a]?.acc_trade_price_24h;
          valueB = currentMarketData[b]?.acc_trade_price_24h;
        }

        if (valueA < valueB) {
          return _orderType === OrderTypes.ASC ? -1 : 1;
        }
        if (valueA > valueB) {
          return _orderType === OrderTypes.ASC ? 1 : -1;
        }
        return 0;
      });
    },
    [marketDic],
  );

  return (
    <S.MarketListBox>
      <input type="text" value={search} placeholder="코인 검색" onChange={(e) => setSearch(e.target.value)} />

      {/* <div className="market-type">
                <MarketType 
                    marketType={MarketTypes.KRW}
                    currentMarketType={marketType}
                    setMarketType={setMarketType}
                />
                <MarketType 
                    marketType={MarketTypes.BTC}
                    currentMarketType={marketType}
                    setMarketType={setMarketType}
                />
                <MarketType 
                    marketType={MarketTypes.USDT}
                    currentMarketType={marketType}
                    setMarketType={setMarketType}
                />
                <MarketType 
                    marketType={MarketTypes.HOLD}
                    currentMarketType={marketType}
                    setMarketType={setMarketType}
                />
            </div> */}

      <div className="market-sort">
        <MarketSortType
          sortType={MarketSortTypes.NAME}
          currentSortType={sortType}
          setSortType={setSortType}
          currentOrderType={orderType}
          setOrderType={setOrderType}
        />
        <MarketSortType
          sortType={MarketSortTypes.PRICE}
          currentSortType={sortType}
          setSortType={setSortType}
          currentOrderType={orderType}
          setOrderType={setOrderType}
        />
        <MarketSortType
          sortType={MarketSortTypes.CHANGE}
          currentSortType={sortType}
          setSortType={setSortType}
          currentOrderType={orderType}
          setOrderType={setOrderType}
        />
        <MarketSortType
          sortType={MarketSortTypes.TRADE_PRICE}
          currentSortType={sortType}
          setSortType={setSortType}
          currentOrderType={orderType}
          setOrderType={setOrderType}
        />
      </div>

      <div className="list">
        {sortedCodes
          .filter((code) => marketFilteredCodeSet.has(code))
          .map((marketCode, index) => (
            <Market key={index} market={marketDic[marketCode]} />
          ))}
      </div>
    </S.MarketListBox>
  );
}

// interface IMarketType {
//   marketType: MarketTypeValues
//   currentMarketType: MarketTypeValues
//   setMarketType: (marketType: MarketTypeValues) => void
// }
// const MarketType = ({ marketType, currentMarketType, setMarketType }: IMarketType) => {
//   return (
//     <button className={marketType === currentMarketType ? 'active' : ''} onClick={() => setMarketType(marketType)}>
//       {MarketTypeNames[marketType]}
//     </button>
//   )
// }

interface IMarketSortType {
  sortType: MarketSortTypeValues;
  currentSortType: MarketSortTypeValues;
  setSortType: (sortType: MarketSortTypeValues) => void;
  currentOrderType: OrderTypeValues;
  setOrderType: (orderType: OrderTypeValues) => void;
}
const MarketSortType = ({
  sortType,
  currentSortType,
  setSortType,
  currentOrderType,
  setOrderType,
}: IMarketSortType) => {
  const handleClick = () => {
    if (sortType === currentSortType) {
      setOrderType(currentOrderType === OrderTypes.ASC ? OrderTypes.DESC : OrderTypes.ASC);
    } else {
      setSortType(sortType);
    }
  };

  return (
    <button className={`${sortType === currentSortType ? 'active' : ''} ${sortType}`} onClick={() => handleClick()}>
      <div className="icon">
        {currentOrderType === OrderTypes.ASC ? (
          <i className="fa-solid fa-sort-up"></i>
        ) : (
          <i className="fa-solid fa-sort-down"></i>
        )}
      </div>
      <span>{MarketSortTypeNames[sortType]}</span>
      <div className="icon opacity-0!">
        <i className="fa-solid fa-sort"></i>
      </div>
    </button>
  );
};

interface IMarket {
  market: CryptoMarket;
}
const Market = ({ market }: IMarket) => {
  const socketData = useMarketPriceStore((state) => state.marketDic[market.code]);
  const [isPriceChangeShow, setIsPriceChangeShow] = useState<boolean>(false);

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
};
