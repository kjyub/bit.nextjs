'use client'

import * as NS from '@/styles/NavigationStyles'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CryptoNavigation() {
  const pathname = usePathname()

  return (
    <NS.Section>
      <Link href="/crypto" className={`btn ${pathname === '/crypto' ? 'active' : ''}`}>
        <i className="fa-solid fa-wallet"></i>
        <span>내 지갑</span>
      </Link>
      <Link href="/crypto/KRW-BTC" className={`btn ${pathname.includes('/crypto/') ? 'active' : ''}`}>
        <i className="fa-solid fa-arrow-trend-up"></i>
        <span>거래소</span>
      </Link>
    </NS.Section>
  )
}
