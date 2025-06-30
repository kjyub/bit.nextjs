'use client';

import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import * as MS from '@/styles/MainStyles';
import type CryptoFlex from '@/types/cryptos/CryptoFlex';
import type { PositionType } from '@/types/cryptos/CryptoTypes';
import { createContext, useCallback, useEffect, useState } from 'react';
import FlexFilter from './filter';
import FlexList from './list';

const PAGE_SIZE = 20;

interface FlexContextType {
  searchValue: string;
  filterPosition: PositionType | null;
  leverageMin: number;
  search: (search: string, filterPosition: PositionType | null, leverageMin: number) => void;
  flexes: Array<CryptoFlex>;
  pageIndex: number;
  itemCount: number;
  isLoading: boolean;
  getNextPage: () => void;
}

export const FlexContext = createContext<FlexContextType>({
  searchValue: '',
  filterPosition: null,
  leverageMin: 1,
  search: () => {},
  flexes: [],
  pageIndex: 1,
  itemCount: 0,
  isLoading: false,
  getNextPage: () => {},
});

export default function FlexView() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [filterPosition, setFilterPosition] = useState<PositionType | null>(null);
  const [leverageMin, setLeverageMin] = useState<number>(1);

  const [flexes, setFlexes] = useState<Array<CryptoFlex>>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [itemCount, setItemCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      await getFlexes(1, '', null, 1);
      setLoading(false);
    })();
  }, []);

  const getFlexes = async (
    _pageIndex: number,
    _search: string,
    _filterPosition: PositionType | null,
    _leverageMin: number,
  ) => {
    const response = await CryptoApi.getFlexList(
      _pageIndex,
      PAGE_SIZE,
      _search,
      _filterPosition !== null ? _filterPosition : undefined,
    );

    if (_pageIndex === 1) {
      setFlexes(response.items);
    } else {
      setFlexes([...flexes, ...response.items]);
    }
    setPageIndex(response.pageIndex >= 0 ? response.pageIndex : _pageIndex);
    setItemCount(response.count);
    setSearchValue(_search);
    setFilterPosition(_filterPosition);
    setLeverageMin(_leverageMin);
  };

  const getNextPage = () => {
    if (isLoading) {
      return;
    }
    setLoading(true);
    getFlexes(pageIndex + 1, searchValue, filterPosition, leverageMin);
    setLoading(false);
  };

  const search = useCallback((_search: string, _filterPosition: PositionType | null, _leverageMin: number) => {
    getFlexes(1, _search, _filterPosition, _leverageMin);
  }, []);

  return (
    <FlexContext.Provider
      value={{ searchValue, filterPosition, leverageMin, search, flexes, pageIndex, itemCount, isLoading, getNextPage }}
    >
      <MS.PageLayout>
        <MS.PageContent className="md:flex-row md:justify-center max-md:p-4 md:p-12 gap-8">
          {/* md 미만의 sticky */}
          <div className="sticky top-4 z-10 flex flex-col">
            <FlexFilter />
          </div>
          <FlexList />
        </MS.PageContent>
      </MS.PageLayout>
    </FlexContext.Provider>
  );
}
