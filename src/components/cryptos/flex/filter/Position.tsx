import type { PositionType } from '@/types/cryptos/CryptoTypes';
import { cn } from '@/utils/StyleUtils';
import { use } from 'react';
import { FlexContext } from '../FlexView';

interface Props {
  positionType: PositionType;
  onSearch: (filterPosition: PositionType | null) => void;
  children: React.ReactNode;
}
export default function FlexFilterPosition({ positionType, onSearch, children }: Props) {
  const { filterPosition } = use(FlexContext);
  const isActive = filterPosition === positionType;

  const handleClick = () => {
    window.scrollTo({ top: 0 });
    onSearch(isActive ? null : positionType);
  };

  return (
    <button
      type="button"
      className={cn([
        'px-3 py-2 rounded-xl layer1 hover',
        'border border-slate-500/20 backdrop-blur-lg',
        { layer2: isActive },
        'transition-colors',
      ])}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
