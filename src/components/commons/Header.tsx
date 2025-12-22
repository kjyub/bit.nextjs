'use client';

import { DEFAULT_MARKET_CODE } from '@/constants/CryptoConsts';
import { useDetectClose } from '@/hooks/useDetectClose';
import { useUser } from '@/hooks/useUser';
import * as NS from '@/styles/NavigationStyles';
import BrowserUtils from '@/utils/BrowserUtils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ControlPanel from './control-panel/ControlPanel';

export default function Header() {
  const pathname = usePathname();

  // 회원 관련
  const { user, isLoading: isUserLoading, isAuth } = useUser();

  const Auth = () => {
    const [ref, isControlPanelOpen, setIsControlPanelOpen] = useDetectClose<HTMLDivElement>();

    return (
      <>
        <Link href="/mypage" className={`btn ${BrowserUtils.isPathActive(pathname, '/mypage') ? 'active' : ''}`}>
          <i className="fa-solid fa-user"></i>
          <span>{user.nickname}님</span>
        </Link>

        <div ref={ref} className="relative">
          <button className="btn" onClick={() => setIsControlPanelOpen(!isControlPanelOpen)} type="button">
            <i className="fa-solid fa-sliders text-sm!"></i>
            <span>메뉴</span>
          </button>
          <ControlPanel
            isOpen={isControlPanelOpen}
            onClose={() => {
              setIsControlPanelOpen(false);
            }}
          />
        </div>
      </>
    );
  };

  const UnAuth = () => {
    return (
      <>
        <Link
          href="/auth"
          className={`btn ${BrowserUtils.isPathActive(pathname, '/auth') ? 'active' : ''} bg-surface-common-background hover:!bg-surface-common-background-active !text-surface-main-text/80`}
        >
          <span>로그인</span>
        </Link>
      </>
    );
  };

  return (
    <NS.Layout>
      <div className="content">
        {/* 왼쪽 */}
        <NS.Section>
          <Link href="/" className="flex flex-center w-24 font-sinchon-rhapsody text-lg translate-y-0.5 select-none">
            KURRITO
          </Link>
          <Link
            href={isAuth ? '/crypto' : `/crypto/${DEFAULT_MARKET_CODE}`}
            className={`btn ${BrowserUtils.isPathActive(pathname, '/crypto') ? 'active' : ''}`}
          >
            <span>코인 거래소</span>
          </Link>
          <Link href="/mine" className={`btn ${BrowserUtils.isPathActive(pathname, '/mine') ? 'active' : ''}`}>
            <span>지하 노역장</span>
          </Link>
          <Link href="/flex" className={`btn ${BrowserUtils.isPathActive(pathname, '/flex') ? 'active' : ''}`}>
            <span>수익 인증</span>
          </Link>
        </NS.Section>
        {/* 오른쪽 */}
        <NS.Section>
          {isUserLoading ? <div className="skeleton w-24 h-full rounded-lg"></div> : isAuth ? <Auth /> : <UnAuth />}
        </NS.Section>
      </div>
    </NS.Layout>
  );
}
