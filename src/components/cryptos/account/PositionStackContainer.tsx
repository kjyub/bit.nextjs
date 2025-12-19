import type { StackHorizonItem } from '@/components/atomics/StackHorizon';
import StackHorizon from '@/components/atomics/StackHorizon';
import useBreakpoint from '@/hooks/useBreakpoint';
import type TradePosition from '@/types/cryptos/TradePosition';
import FormatUtils from '@/utils/FormatUtils';
import { useMemo } from 'react';

const VISIBLE_STACK_COUNT = 4;

const COLORS = [
  '#f8717155',
  '#fb923c55',
  '#fbbf2455',
  '#facc1555',
  '#a3e63555',
  '#4ade8055',
  '#34d39955',
  '#2dd4bf55',
  '#22d3ee55',
  '#38bdf855',
  '#60a5fa55',
  '#818cf855',
  '#a78bfa55',
  '#c084fc55',
  '#e879f955',
  '#f472b655',
  '#fb718555',
];
// key: 0 ~ 17 value: 0 ~ 17 random index
const randomIndex: Record<number, number> = {
  0: 12,
  1: 5,
  2: 16,
  3: 8,
  4: 1,
  5: 14,
  6: 3,
  7: 9,
  8: 15,
  9: 7,
  10: 2,
  11: 11,
  12: 6,
  13: 0,
  14: 13,
  15: 4,
  16: 10,
};
const getColor = (index: number) => {
  const i = index % Object.keys(randomIndex).length;
  const ri = randomIndex[i];
  return COLORS[ri];
};

interface Values {
  items: StackHorizonItem[];
  others: StackHorizonItem[];
}

interface Props {
  positions: TradePosition[];
  balance: number;
  isLoading: boolean;
}
export default function PositionStackContainer({ positions, balance, isLoading }: Props) {
  const { breakpointState } = useBreakpoint();

  const values = useMemo(() => {
    let visibleCount = VISIBLE_STACK_COUNT;
    if (breakpointState.md) {
      visibleCount = VISIBLE_STACK_COUNT;
    } else if (breakpointState.sm) {
      visibleCount = VISIBLE_STACK_COUNT - 1;
    } else if (!breakpointState.sm) {
      visibleCount = VISIBLE_STACK_COUNT - 2;
    }
    const values: Values = {
      items: [],
      others: [],
    };

    const total = balance + positions.reduce((acc, position) => acc + position.marginPrice, 0);
    const items: StackHorizonItem[] = positions.map((position, index) => ({
      content: `${position.market.code.split('-')[1]} ${FormatUtils.percent(position.marginPrice / total)}`,
      ratio: (position.marginPrice / total) * 100,
      widthRatio: (position.marginPrice / total) * 100,
      color: getColor(index),
    }));

    const walletRatio = balance === 0 || total === 0 ? 1 : balance / total;
    items.push({
      content: `내 지갑 ${FormatUtils.percent(walletRatio)}`,
      ratio: 100 - items.reduce((acc, item) => acc + item.ratio, 0),
      widthRatio: 100 - items.reduce((acc, item) => acc + item.ratio, 0),
      color: '#90a1b955',
    });

    items.sort((a, b) => b.ratio - a.ratio);

    // widthRatio가 20% 미만인 항목들을 others로 분류
    const threshold = 20; // 20% 기준
    const mainItems: StackHorizonItem[] = [];
    const otherItems: StackHorizonItem[] = [];

    for (const item of items) {
      if (item.widthRatio >= threshold) {
        mainItems.push(item);
      } else {
        otherItems.push(item);
      }
    }

    // items가 1개일 때는 widthRatio를 100%로 설정
    if (items.length === 1) {
      mainItems[0].widthRatio = 100;
      values.items = mainItems;
      values.others = [];
      return values;
    }

    // 20% 이상인 항목이 있으면 비율 조정
    if (otherItems.length > 0) {
      // items의 비율이 80%를 넘어가면 80%로 제한
      const totalMainRatio = mainItems.reduce((acc, item) => acc + item.ratio, 0);
      let ratio = 1;
      if (totalMainRatio > 80) {
        ratio = 80 / totalMainRatio;
      }
      mainItems.forEach((item) => {
        item.widthRatio = item.ratio * ratio;
      });
    } else {
      mainItems.forEach((item) => {
        item.widthRatio = item.ratio;
      });
    }

    // others의 widthRatio를 items를 제외한 나머지로 설정
    if (otherItems.length > 0) {
      const totalMainWidthRatio = mainItems.reduce((acc, item) => acc + item.widthRatio, 0);
      const remainingWidthRatio = 100 - totalMainWidthRatio;
      otherItems.forEach((item) => {
        item.widthRatio = remainingWidthRatio;
      });
    }

    values.items = mainItems;
    values.others = otherItems;

    return values;
  }, [positions, balance, breakpointState]);

  return (
    <div className="flex flex-col w-full gap-2">
      <span className="text-slate-300">투자 비율</span>
      {isLoading ? (
        <StackHorizon items={[]} others={[]} />
      ) : (
        <StackHorizon items={values.items} others={values.others} />
      )}
    </div>
  );
}
