"use client"

import * as MS from "@/styles/MainStyles"
import * as S from "@/styles/CryptoWalletStyles"
import CryptoNavigation from "./CryptoNavigation"
import CommonButton from "../atomics/buttons/CommonButton"
import ModalContainer from "../ModalContainer"
import { TransferTypes } from "@/types/cryptos/CryptoTypes"
import CryptoTransferModal from "./CryptoTransferModal"
import { useEffect, useState } from "react"
import CryptoApi from "@/apis/api/cryptos/CryptoApi"
import UserApi from "@/apis/api/users/UserApi"
import useUserInfoStore from "@/store/useUserInfo"
import CommonUtils from "@/utils/CommonUtils"
import { TextFormats } from "@/types/CommonTypes"

export default function CryptoMain() {
    const [isTransferModalOpen, setTransferModalOpen] = useState<boolean>(false)
    const [transferType, setTransferType] = useState<TransferTypes>(TransferTypes.TO_WALLET)

    const { cash, balance, updateInfo } = useUserInfoStore()

    useEffect(() => {
        updateInfo()
    }, [])

    const handleTransferModal = (type: TransferTypes) => {
        setTransferType(type)
        setTransferModalOpen(true)
    }

    return (
        <S.Layout>
            <S.WalletLayout>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <S.WalletBox>
                        <div className="header">
                            <div className="title">내 통장</div>
                            <CommonButton 
                                onClick={() => {handleTransferModal(TransferTypes.TO_ACCOUNT)}}
                                className="space-x-1 [&>i]:text-xs"
                            >
                                <span>
                                    거래 지갑
                                </span>
                                <i className="fa-solid fa-arrow-right"></i>
                                <span>
                                    통장
                                </span>
                            </CommonButton>
                        </div>
                        <div className="content">
                            <div className="label">총 잔액</div>
                            <div className="value">{CommonUtils.textFormat(cash, TextFormats.NUMBER)}W</div>
                        </div>
                    </S.WalletBox>
                    <S.WalletBox>
                        <div className="header">
                            <div className="title">내 거래 지갑</div>
                            <CommonButton 
                                onClick={() => {handleTransferModal(TransferTypes.TO_WALLET)}}
                                className="space-x-1 [&>i]:text-xs"
                            >
                                <span>
                                    통장
                                </span>
                                <i className="fa-solid fa-arrow-right"></i>
                                <span>
                                    거래 지갑
                                </span>
                            </CommonButton>
                        </div>
                        <div className="content">
                            <div className="label">거래 중</div>
                            <div className="value">0</div>
                        </div>
                        <div className="content">
                            <div className="label">거래 대기</div>
                            <div className="value">{CommonUtils.textFormat(balance, TextFormats.NUMBER)}C</div>
                        </div>
                    </S.WalletBox>
                </div>
            </S.WalletLayout>

            <ModalContainer
                isOpen={isTransferModalOpen}
                setIsOpen={setTransferModalOpen}
            >
                <CryptoTransferModal
                    defaultTransferType={transferType}
                    cash={cash}
                    balance={balance}
                />
            </ModalContainer>
        </S.Layout>
    )
}