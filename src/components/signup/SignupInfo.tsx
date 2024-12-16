"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import * as SS from "@/styles/SignupStyles"
import Image from "next/image"
import KakaoImage from "@/static/svgs/btn_kakao.svg"
import ModalContainer from "../ModalContainer"
import InfoModal from "../commons/InfoModal"
import AuthUtils from "@/utils/AuthUtils"
import * as I from "@/components/inputs/UserInputs"
import UserApi from "@/apis/api/users/UserApi"
import { debounce } from "lodash"
import CountUp from "react-countup"
import User from "@/types/users/User"
import CommonUtils from "@/utils/CommonUtils"
import { useRouter } from "next/navigation"
import Alerts from "@/components/Alerts"
import { useSession } from "next-auth/react"

export default function SignupInfo() {
    const router = useRouter()

    const { data: session, status, update } = useSession()

    const [nickname, setNickname] = useState<string>("")

    const isDuplicateNicknameRef = useRef<boolean>(false)
    const isValidNicknameRef = useRef<boolean>(false)

    const [isValidUserInfo, setValidUserInfo] = useState<boolean>(false)

    const [isActiveGameInfo, setActiveGameInfo] = useState<boolean>(false) // 게임 정보 활성화 여부
    const [isActiveSave, setActiveSave] = useState<boolean>(false) // 회원가입 버튼 활성화 여부

    useEffect(() => {
        if (nickname.length < 2) {
            isValidNicknameRef.current = false
            isDuplicateNicknameRef.current = false
            return
        }

        if (nickname.length > 10) {
            isValidNicknameRef.current = false
        }

        isValidNicknameRef.current = true
        checkNicknameDuplicate()
    }, [nickname])

    useEffect(() => {
        setValidUserInfo(isValidNicknameRef.current)

        if (isValidNicknameRef.current) {
            setActiveGameInfo(true)

            // 효과를 위한 코드
            if (isActiveGameInfo) {
                setActiveSave(true)
            }
        } else {
            setActiveSave(false)
        }
    }, [isValidNicknameRef.current])

    const checkNicknameDuplicate = useCallback(() => {
        debounce(() => {
            UserApi.checkNickname(nickname).then((isExist) => {
                isDuplicateNicknameRef.current = isExist
            })
        }, 500)
    }, [nickname])

    const handleSave = async () => {
        if (!isValidUserInfo) {
            return
        }

        const userData = await UserApi.kakaoAuthSignup({
            nickname: nickname
        })

        const user = new User()
        user.parseResponse(userData)

        if (!CommonUtils.isStringNullOrEmpty(user.uuid)) {
            const updated = await update({
                ...session,
                user: userData
            })

            router.push("/")
            return
        } else {
            Alerts.alert("회원가입 실패", "회원가입에 실패했습니다. 다시 시도해주세요.", "error")
        }
    }

    return (
        <SS.Layout className="space-y-4">
            <SS.BoxContainer className="max-sm:w-[80vw] sm:w-80">
                <div className="flex flex-col items-center w-full">
                    <SS.Title>
                        회원가입
                    </SS.Title>
                </div>

                <SS.SignupSection className="" $is_active={true}>
                    <span className="title">회원 정보</span>

                    <I.Input 
                        type="text"
                        placeholder="닉네임"
                        label="닉네임"
                        value={nickname}
                        onChange={(e) => {
                            if (e.target.value.length > 10) {
                                return
                            }
                            setNickname(e.target.value)
                        }}
                        helpText="2자 이상 10자 이하로 입력해주세요."
                        errorMessage={isDuplicateNicknameRef.current ? "이미 사용중인 닉네임입니다." : ""}
                    />
                </SS.SignupSection>

                <SS.SignupSection className={`mt-10`} $is_active={isActiveGameInfo}>
                    <span className="title">게임 정보</span>

                    <div className="flex flex-col w-full space-y-2">
                        <SS.SignupSectionItem>
                            <span className="title">초기 자금</span>
                            <span className="value">
                                {!isActiveGameInfo ? 0 : (
                                    <CountUp 
                                        start={0} end={10000000} 
                                        duration={2} 
                                        suffix=" C" 
                                        onEnd={() => {
                                            if (isValidNicknameRef.current) {
                                                setActiveSave(true)
                                            }
                                        }}
                                    />
                                )}
                            </span>
                        </SS.SignupSectionItem>
                    </div>
                </SS.SignupSection>

                <SS.SignupSection className={`mt-8`} $is_active={isActiveSave}>
                    <SS.SignupButton $is_active={isActiveSave} onClick={() => {handleSave()}}>
                        회원가입
                    </SS.SignupButton>
                </SS.SignupSection>
            </SS.BoxContainer>
        </SS.Layout>
    )
}