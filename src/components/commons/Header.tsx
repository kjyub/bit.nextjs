'use client';

import { DEFAULT_MARKET_CODE } from '@/constants/CryptoConsts';
import { useUser } from '@/hooks/useUser';
import * as NS from '@/styles/NavigationStyles';
import Link from 'next/link';

export default function Header() {
  // 회원 관련
  const { user, isLoading: isUserLoading, signOut, isAuth } = useUser();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <NS.Layout>
      <div className="content">
        {/* 왼쪽 */}
        <NS.Section>
          <Link href="/" className="btn">
            <span>Home</span>
          </Link>
          <Link href={isAuth ? '/crypto' : `/crypto/${DEFAULT_MARKET_CODE}`} className="btn">
            <span>암호화폐 거래</span>
          </Link>
        </NS.Section>
        {/* 오른쪽 */}
        <NS.Section>
          {isUserLoading ? (
            <div className="skeleton w-24 h-full rounded-lg"></div>
          ) : isAuth ? (
            // 회원
            <>
              <span>{user.nickname}님</span>
              <button className="btn" onClick={handleLogout}>
                <span>로그아웃</span>
              </button>
            </>
          ) : (
            // 비회원
            <>
              <Link href="/auth" className="btn bg-slate-100/10 hover:!bg-slate-100/20 !text-slate-300/80">
                <span>로그인 / 가입</span>
              </Link>
            </>
          )}
        </NS.Section>
      </div>
    </NS.Layout>
  );
}
