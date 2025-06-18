'use client';

import { DEFAULT_MARKET_CODE } from '@/constants/CryptoConsts';
import { useUser } from '@/hooks/useUser';
import * as NS from '@/styles/NavigationStyles';
import CommonUtils from '@/utils/CommonUtils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ControlPanel from './control-panel/ControlPanel';
import { useDetectClose } from '@/hooks/useDetectClose';

export default function Header() {
  const pathname = usePathname();

  // 회원 관련
  const { user, isLoading: isUserLoading, isAuth } = useUser();

  const Auth = () => {
    const [ref, isControlPanelOpen, setIsControlPanelOpen] = useDetectClose<HTMLDivElement>();

    return (
      <>
        <Link href="/mypage" className={`btn ${CommonUtils.isPathActive(pathname, '/mypage') ? 'active' : ''}`}>
          <i className="fa-solid fa-user"></i>
          <span>{user.nickname}님</span>
        </Link>

        <div ref={ref} className="relative">
          <button className="btn" onClick={() => setIsControlPanelOpen(!isControlPanelOpen)} type="button">
            <i className="fa-solid fa-sliders text-sm!"></i>
          </button>
          <ControlPanel isOpen={isControlPanelOpen} onClose={() => {setIsControlPanelOpen(false);}} />
        </div>
      </>
    )
  }

  const UnAuth = () => {
    return (
      <>
        <Link href="/auth" className={`btn ${CommonUtils.isPathActive(pathname, '/auth') ? 'active' : ''} bg-slate-100/10 hover:!bg-slate-100/20 !text-slate-300/80`}>
          <span>로그인</span>
        </Link>
      </>
    )
  }

  return (
    <NS.Layout>
      <div className="content">
        {/* 왼쪽 */}
        <NS.Section>
          <Link href="/" className="flex flex-center w-24 font-sinchon-rhapsody text-lg translate-y-0.5">
            KURRITO
          </Link>
          <Link
            href={isAuth ? '/crypto' : `/crypto/${DEFAULT_MARKET_CODE}`}
            className={`btn ${CommonUtils.isPathActive(pathname, '/crypto') ? 'active' : ''}`}
          >
            <span>암호화폐 거래</span>
          </Link>
        </NS.Section>
        {/* 오른쪽 */}
        <NS.Section>
          {isUserLoading ? (
            <div className="skeleton w-24 h-full rounded-lg"></div>
          ) : isAuth ? <Auth /> : <UnAuth />}
        </NS.Section>
      </div>
    </NS.Layout>
  );
}
