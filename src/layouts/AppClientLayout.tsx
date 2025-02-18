"use client"

import TradeGoApi from "@/apis/api/cryptos/TradeGoApi"
import ToastPopup from "@/components/commons/ToastPopup"
import ModalContainer from "@/components/ModalContainer"
import { useUser } from "@/hooks/useUser"
import useUserInfoStore from "@/store/useUserInfo"
import { CookieConsts } from "@/types/ApiTypes"
import ApiUtils from "@/utils/ApiUtils"
import BrowserUtils from "@/utils/BrowserUtils"
import CommonUtils from "@/utils/CommonUtils"
import StyleUtils from "@/utils/StyleUtils"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export default function AppClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    
    const [user, isUserLoading] = useUser()
    const [isInAppBrowser, setIsInAppBrowser] = useState<boolean>(false)

    // 유저 거래 정보 알람
    const userAlarmSocketRef = useRef<WebSocket | null>(null)
    const userInfoUpdate = useUserInfoStore.getState().updateInfo

    // 유저 거래 정보 알람 소켓 초기화
    useEffect(() => {
        if (user.id >= 0) {
            userInfoUpdate()
            userAlarmSocketRef.current = TradeGoApi.initUserAlarmWebSocket(user.id)
        }

        return () => {
            if (!CommonUtils.isStringNullOrEmpty(user.uuid)) {
                userAlarmSocketRef.current.close()
            }
        }
    }, [user.uuid, userInfoUpdate])

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
