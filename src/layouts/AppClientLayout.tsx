'use client'

import TradeGoApi from '@/apis/api/cryptos/TradeGoApi'
import ToastPopup from '@/components/commons/ToastPopup'
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

  const [user, _isUserLoading] = useUser()

  const [_isInAppBrowser, setIsInAppBrowser] = useState<boolean>(false)

  // 유저 거래 정보 알람
  const userInfoUpdate = useUserInfoStore((state) => state.updateInfo)
  const addToastMessage = useToastMessageStore((state) => state.addMessage)

  // 유저 거래 정보 알람 소켓 초기화
  useEffect(() => {
    const userAlarmSocket = TradeGoApi.getAlarmSocket()
    if (userAlarmSocket) {
      userAlarmSocket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string)
          addToastMessage(String(data.content))
          userInfoUpdate()
        } catch (error) {
          console.log('Failed to parse WebSocket message', error)
        }
      }
    }

    return () => {
      if (userAlarmSocket) {
        userAlarmSocket.close()
      }
    }
  }, [user.id])

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
