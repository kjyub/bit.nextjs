"use client"

import { useUser } from "@/hooks/useUser"
import * as NS from "@/styles/NavigationStyles"
import { AccountStatusTypes } from "@/types/users/UserTypes"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navigation() {

    // 회원 관련
    const [user, isUserLoading] = useUser()
    const [isAuth, setAuth] = useState<boolean>(false)

    useEffect(() => {
        setAuth(user.accountStatus === AccountStatusTypes.NORMAL)
    }, [user])

    const handleLogout = async () => {
        signOut().then(() => {
            setAuth(false)
        })
    }

    return (
        <NS.Layout>
            <div className="content">
                {/* 왼쪽 */}
                <NS.Section>
                    <button className="btn">
                        <span>Home</span>
                    </button>
                    <Link href="/crypto" className="btn">
                        <span>암호화폐 거래</span>
                    </Link>
                </NS.Section>
                {/* 오른쪽 */}
                <NS.Section>
                    {isUserLoading ? (
                        <div className="skeleton w-24 h-full rounded-lg">
                        </div>
                    ) : (
                        isAuth ? (
                            // 회원
                            <>
                                <span>{user.nickname}님</span>
                                <button className="btn" onClick={() => {handleLogout()}}>
                                    <span>로그아웃</span>
                                </button>
                            </>
                        ) : (
                            // 비회원
                            <>
                                <button className="btn">
                                    <span>로그인</span>
                                </button>
                                <Link href="/signup" className="btn border border-slate-300">
                                    <span>회원가입</span>
                                </Link>
                            </>
                        )
                    )}
                </NS.Section>
            </div>
        </NS.Layout>
    )
}