'use client';

import { DEFAULT_MARKET_CODE } from '@/constants/CryptoConsts';
import { useIsScrollUp } from '@/hooks/useIsScrollUp';
import { useUser } from '@/hooks/useUser';
import * as NS from '@/styles/MobileGNBStyles';
import CommonUtils from '@/utils/CommonUtils';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import MobileMenu from './control-panel/MobileMenu';

export default function MobileGNB() {
  // 회원 관련
  const { isLoading: isUserLoading, isAuth } = useUser();
  const isScrollUp = useIsScrollUp();
  const pathname = usePathname();

  const [isHide, setIsHide] = useState(false);
  const isHideTimer = useRef<NodeJS.Timeout | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    }
  }, [isScrollUp])

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname])

  const handleMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <NS.Layout $is_show={!isHide}>
      <div className="grid grid-cols-5 w-full h-full">
        <NS.LinkButton href="/" className={CommonUtils.isPathActive(pathname, '/') ? 'active' : ''}>
          <i className="fa-solid fa-house"></i>
          <span>홈</span>
        </NS.LinkButton>
        <NS.LinkButton
          href={isAuth ? '/crypto' : `/crypto/${DEFAULT_MARKET_CODE}`}
          className={CommonUtils.isPathActive(pathname, '/crypto') ? 'active' : ''}
        >
          <i className="fa-solid fa-coins"></i>
          <span>거래소</span>
        </NS.LinkButton>
        <NS.LinkButton href="/mine" className={CommonUtils.isPathActive(pathname, '/mine') ? 'active' : ''}>
          <i className="fa-solid fa-hammer"></i>
          <span>지하노역장</span>
        </NS.LinkButton>
        <NS.LinkButton href="#" onClick={handleMenu}>
          <i className="fa-solid fa-sliders"></i>
          <span>메뉴</span>
        </NS.LinkButton>
        <div className="flex gap-2">
          {isUserLoading ? (
            <div className="skeleton w-24 h-full rounded-lg"></div>
          ) : isAuth ? (
            // 회원
            <NS.LinkButton href="/mypage">
              <i className="fa-solid fa-user"></i>
              <span>내 정보</span>
            </NS.LinkButton>
          ) : (
            // 비회원
            <NS.LinkButton href="/auth" className={CommonUtils.isPathActive(pathname, '/auth') ? 'active' : ''}>
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>로그인</span>
            </NS.LinkButton>
          )}
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </NS.Layout>
  );
}
