'use client'

import TradeGoApi from '@/apis/api/cryptos/TradeGoApi'
import ToastPopup from '@/components/commons/ToastPopup'
import useAlarmSocket from '@/hooks/sockets/useAlarmSocket'
import { useUser } from '@/hooks/useUser'
import useToastMessageStore from '@/store/useToastMessageStore'
import useUserInfoStore from '@/store/useUserInfo'
import BrowserUtils from '@/utils/BrowserUtils'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AppClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [_isInAppBrowser, setIsInAppBrowser] = useState<boolean>(false)

  useAlarmSocket()

  useEffect(() => {
    // 인앱 브라우저 인식 후 외부 브라우저로 이동
    const isRedirect = BrowserUtils.goExternalBrowser()
    setIsInAppBrowser(isRedirect)
  }, [pathname])

  return (
    <>
      <ToastPopup />
      {children}
    </>
  )
}
