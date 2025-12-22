'use client';

import { useCryptoUi } from '@/hooks/useCryptoUi';
import { useIsScrollUp } from '@/hooks/useIsScrollUp';
import * as NS from '@/styles/NavigationStyles';
import type { StyleProps } from '@/types/StyleTypes';
import { cn } from '@/utils/StyleUtils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';

const Layout = tw.div<StyleProps>`
  max-md:top-0 md:top-0 z-40 
  max-md:hidden md:flex w-full max-md:px-4 max-xl:px-2 border-b border-surface-common-border
`;

const Section = tw(NS.Section)`
  w-full h-12 px-2
`;

const Navigation = () => {
  const pathname = usePathname();
  const params = useParams();
  const { isShowMarketList, setIsShowMarketList } = useCryptoUi();

  // 현재 URL에서 code 파라미터를 가져오거나 기본값 사용
  const currentCode = params?.code || 'KRW-BTC';

  return (
    <>
      <Link href="/crypto" className={`btn ${pathname === '/crypto' ? 'active' : ''}`}>
        <i className="fa-solid fa-wallet"></i>
        <span>내 지갑</span>
      </Link>
      <Link href={`/crypto/${currentCode}`} className={`btn ${pathname === `/crypto/${currentCode}` ? 'active' : ''}`}>
        <i className="fa-solid fa-arrow-trend-up"></i>
        <span>거래소</span>
      </Link>
      <Link
        href={`/crypto/${currentCode}/community`}
        className={`btn ${pathname === `/crypto/${currentCode}/community` ? 'active' : ''}`}
      >
        <i className="fa-solid fa-comments"></i>
        <span>토론방</span>
      </Link>
      <button
        className={cn([
          'btn ml-auto',
          'group-[.compact]/crypto:lg:!hidden group-[.wide]/crypto:full:!hidden',
          { active: isShowMarketList },
        ])}
        onClick={() => setIsShowMarketList(!isShowMarketList)}
        type="button"
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>종목 검색</span>
      </button>
    </>
  );
};

export const CryptoNavigation = () => {
  return (
    <Layout>
      <Section>
        <Navigation />
      </Section>
    </Layout>
  );
};

const MobileLayout = tw.div<StyleProps>`
  fixed inset-x-0 bottom-15 z-40 
  max-md:flex md:hidden justify-center w-full
  duration-300

  ${({ $is_active }: StyleProps) => ($is_active ? '' : 'translate-y-10')}
  will-change-transform
`;

const MobileSection = tw.div`
  grid grid-cols-4 h-10 p-1
  rounded-full bg-surface-floating-background backdrop-blur-lg
  border border-surface-floating-border

  [&_.btn]:flex [&_.btn]:justify-center [&_.btn]:items-center [&_.btn]:px-1.5 [&_.btn]:py-1 [&_.btn]:space-x-1
  [&_.btn]:rounded-full [&_.btn]:hover:bg-white/10
  max-md:[&_.btn]:text-sm
  [&_.btn]:text-surface-main-text/70 [&_.btn]:hover:text-surface-main-text [&_.btn]:font-semibold
  [&_.btn.active]:text-surface-main-text
  [&_.btn]:transition-colors [&_.btn]:select-none
  [&_.btn>i]:text-xs
  [&>button]:ml-0
`;

export const CryptoMobileNavigation = () => {
  const isScrollUp = useIsScrollUp();
  const [isHide, setIsHide] = useState(false);
  const isHideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isScrollUp) {
      setIsHide(false);
    } else {
      if (isHideTimer.current) clearTimeout(isHideTimer.current);
      isHideTimer.current = setTimeout(() => {
        setIsHide(true);
      }, 500);
    }

    return () => {
      if (isHideTimer.current) {
        clearTimeout(isHideTimer.current);
      }
    };
  }, [isScrollUp]);

  return (
    <MobileLayout $is_active={!isHide}>
      <MobileSection>
        <Navigation />
      </MobileSection>
    </MobileLayout>
  );
};
