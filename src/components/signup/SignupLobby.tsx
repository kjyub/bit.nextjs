"use client"

import React from "react"
import * as SS from "@/styles/SignupStyles"
import Image from "next/image"
import KakaoImage from "@/static/svgs/btn_kakao.svg"
import ModalContainer from "../ModalContainer"
import InfoModal from "../commons/InfoModal"
import AuthUtils from "@/utils/AuthUtils"

export default function SignupLobby() {
    const [isShowAgreement, setShowAgreement] = React.useState<boolean>(false)
    console.log(KakaoImage)

    const handleKakao = () => {
        AuthUtils.authKakao()
    }

    return (
        <SS.Layout>
            <SS.BoxContainer className="space-y-2">
                <div className="flex flex-col items-center md:w-128">
                    <SS.Title>
                        회원가입
                    </SS.Title>
                </div>

                <SS.AuthTypeSection>
                    <span className="title animate-fade-in">
                        로그인 유형을 선택해주세요
                    </span>

                    <div className="types animate-fade-in">
                        <button 
                            className="bg-kakao-container rounded-xl px-5 py-1"
                            onClick={() => {handleKakao()}}
                        >
                            <KakaoImage width={30} height={30} viewBox="0 0 20 20" />
                            <span className="pr-1 text-kakao-text">카카오 로그인</span>
                        </button>
                    </div>

                    <div className="agreement">
                        {`로그인 시 `}
                        <button onClick={() => {setShowAgreement(true)}}>서비스 이용약관</button>
                        {`에 동의하게 됩니다.`}
                    </div>
                </SS.AuthTypeSection>
            </SS.BoxContainer>

            <ModalContainer
                isOpen={isShowAgreement}
                setIsOpen={setShowAgreement}
            >
                <InfoModal 
                    title="개인정보 수집 및 이용 동의"
                    content={"개인정보 수집 및 이용에 대한 동의 내용입니다.\n로그인 및 회원 기능 목적으로 탈퇴 후 1년까지 사용됩니다."}
                />
            </ModalContainer>
        </SS.Layout>
    )
}