import type { StackHorizonItem } from "@/components/atomics/StackHorizon";
import StackHorizon from "@/components/atomics/StackHorizon";
import useBreakpoint from "@/hooks/useBreakpoint";
import type TradePosition from "@/types/cryptos/TradePosition";
import TypeUtils from "@/utils/TypeUtils";
import { useMemo } from "react";

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
]
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
  16: 10
}
const getColor = (index: number) => {
  const i = index % Object.keys(randomIndex).length;
  const ri = randomIndex[i];
  return COLORS[ri];
}

interface Values {
  items: StackHorizonItem[];
  others: StackHorizonItem[];
}

interface Props {
  positions: TradePosition[];
  balance: number;
}
export default function PositionStackContainer({ positions, balance }: Props) {
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
      others: []
    };

    const total = balance + positions.reduce((acc, position) => acc + position.marginPrice, 0);
    const items: StackHorizonItem[] = positions.map((position, index) => ({
      content: `${position.market.code.split("-")[1]} ${TypeUtils.percent(position.marginPrice / total)}`,
      ratio: position.marginPrice / total * 100,
      color: getColor(index)
    }))

    items.push({
      content: `내 지갑 ${TypeUtils.percent(balance / total)}`,
      ratio: 100 - items.reduce((acc, item) => acc + item.ratio, 0),
      color: "#90a1b955"
    })
    
    if (items.length > visibleCount) {
      values.items = items.slice(0, visibleCount);
      values.others = items.slice(visibleCount);
    } else {
      values.items = items;
    }

    return values;
  }, [positions, balance, breakpointState]);

  return (
    <div className="flex flex-col w-full gap-2">
      <span className="text-slate-300">투자 비율</span>
      <StackHorizon items={values.items} others={values.others} />
    </div>
  );
}