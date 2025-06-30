'use client';

import { type PositionType, PositionTypes } from '@/types/cryptos/CryptoTypes';
import { use } from 'react';
import { FlexContext } from '../FlexView';
import FlexFilterPosition from './Position';
import FlexSearch from './Search';

export default function FlexFilter() {
  const { searchValue, filterPosition, leverageMin, search } = use(FlexContext);

  const handleSearch = (searchValue: string) => {
    search(searchValue, filterPosition, leverageMin);
  };

  const handleFilterPosition = (filterPosition: PositionType | null) => {
    search(searchValue, filterPosition, leverageMin);
  };

  return (
    // md 이상의 sticky
    <div className="sticky top-26 flex flex-col max-md:w-full md:w-72 gap-3">
      <FlexSearch onSearch={handleSearch} />
      <div className="flex gap-2">
        <FlexFilterPosition positionType={PositionTypes.LONG} onSearch={handleFilterPosition}>
          <span className="text-sm text-slate-300">롱 포지션</span>
        </FlexFilterPosition>
        <FlexFilterPosition positionType={PositionTypes.SHORT} onSearch={handleFilterPosition}>
          <span className="text-sm text-slate-300">숏 포지션</span>
        </FlexFilterPosition>
      </div>
    </div>
  );
}
