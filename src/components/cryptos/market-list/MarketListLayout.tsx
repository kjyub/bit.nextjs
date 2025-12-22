'use client';

import useBreakpoint from '@/hooks/useBreakpoint';
import { useCryptoUi } from '@/hooks/useCryptoUi';
import { cn } from '@/utils/StyleUtils';
import MarketListFloating from './MarketListFloating';

export default function MarketListLayout({ children }: { children: React.ReactNode }) {
  const { layoutMode } = useCryptoUi();
  const { breakpointState, width } = useBreakpoint();

  // 아직 렌더링 되지 않은 경우
  if (width === 0) {
    return <Skeleteon />;
  }

  const isWide = layoutMode === 'wide';
  const showFloating = isWide ? !breakpointState.full : !breakpointState.lg;
  const showStatic = isWide ? breakpointState.full : breakpointState.lg;

  // 넓은 화면에서 고정된 마켓 리스트 표시
  if (showStatic) {
    return <div className="sticky -top-2 z-0 flex flex-col w-96 h-[calc(100dvh-144px)] p-4 pt-6 gap-4">{children}</div>;
  }

  // 모바일 화면에서 플로팅 마켓 리스트 표시
  if (showFloating) {
    return <MarketListFloating>{children}</MarketListFloating>;
  }

  return null;
}

function Skeleteon() {
  return (
    <div
      className={cn([
        // wide 일 시
        'group-[.wide]/crypto:max-full:hidden',
        // compact 일 시
        'group-[.compact]/crypto:max-lg:hidden',
      ])}
    >
      <div className={cn(['sticky top-0 z-0', 'flex flex-col max-sm:w-full sm:w-96 h-[calc(100dvh-144px)]'])}>
        <div className="skeleton w-full h-full"></div>
      </div>
    </div>
  );
}
