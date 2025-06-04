import { type OrderTypeValues, OrderTypes } from '@/types/common/CommonTypes';
import { MarketSortTypeNames, type MarketSortTypeValues } from '@/types/cryptos/CryptoTypes';
import { memo } from 'react';

interface Props {
  sortType: MarketSortTypeValues;
  currentSortType: MarketSortTypeValues;
  setSortType: (sortType: MarketSortTypeValues) => void;
  currentOrderType: OrderTypeValues;
  setOrderType: (orderType: OrderTypeValues) => void;
}
export default memo(function MarketSortType({
  sortType,
  currentSortType,
  setSortType,
  currentOrderType,
  setOrderType,
}: Props) {
  const handleClick = () => {
    if (sortType === currentSortType) {
      setOrderType(currentOrderType === OrderTypes.ASC ? OrderTypes.DESC : OrderTypes.ASC);
    } else {
      setSortType(sortType);
      setOrderType(OrderTypes.DESC);
    }
  };

  return (
    <button
      className={`${sortType === currentSortType ? 'active' : ''} ${sortType}`}
      type="button"
      onClick={() => handleClick()}
    >
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
});
