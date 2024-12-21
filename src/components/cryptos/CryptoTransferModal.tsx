"use client"
import * as S from "@/styles/CryptoWalletStyles"
import * as I from "@/components/inputs/UserInputs"
import ModalLayout from "../atomics/ModalLayout"
import { TransferTypes, WalletTransactionType } from "@/types/cryptos/CryptoTypes"
import { useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import { TextFormats } from "@/types/CommonTypes"
import { useUser } from "@/hooks/useUser"
import CryptoWallet from "@/types/cryptos/CryptoWallet"
import CryptoApi from "@/apis/api/cryptos/CryptoApi"
import UserApi from "@/apis/api/users/UserApi"
import useUserInfoStore from "@/store/useUserInfo"

const TransferSuffix = {
    [TransferTypes.TO_ACCOUNT]: "C",
    [TransferTypes.TO_WALLET]: "W"
}

interface CryptoTransferModalProps {
    defaultTransferType: TransferTypes
    cash: number
    balance: number

}
export default function CryptoTransferModal({ defaultTransferType }: CryptoTransferModalProps) {
    // 타입 및 스타일
    const [transferType, setTransferType] = useState<TransferTypes>(defaultTransferType)
    const [isBgActive, setBgActive] = useState<boolean>(false)

    // 잔액
    const { cash, balance, updateInfo } = useUserInfoStore()

    // 이체 값
    const [value, setValue] = useState<number>(0)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isValid, setValid] = useState<boolean>(false)
    
    // 잔액 정보 불러오기
    useEffect(() => {
        updateInfo()
    }, [])

    // 이체 값 검증
    useEffect(() => {
        if (transferType === TransferTypes.TO_ACCOUNT) {
            if (value > balance) {
                setErrorMessage("거래 지갑 잔액이 부족합니다.")
                setValid(false)
            } else {
                setErrorMessage("")
                setValid(true)
            }
        } else if (transferType === TransferTypes.TO_WALLET) {
            if (value > cash) {
                setErrorMessage("통장 잔액이 부족합니다.")
                setValid(false)
            } else {
                setErrorMessage("")
                setValid(true)
            }
        }
    }, [value])

    const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const _value = Number(e.target.value.replaceAll(",", ""))
        if (isNaN(_value)) return

        if (_value < 0) return

        setValue(_value)
    }

    const handleTransfer = async () => {
        if (!isValid) return

        const data = {
            transaction_type: transferType === TransferTypes.TO_ACCOUNT ? WalletTransactionType.WITHDRAW : WalletTransactionType.DEPOSIT,
            amount: value
        }

        const response = await CryptoApi.transactionWallet(data)
        if (response) {
            setValue(0)
            updateInfo()
            alert("이체가 완료되었습니다.")
            return
        } else {
            alert("이체에 실패하였습니다.")
            return
        }
    }

    return (
        <ModalLayout
            title={`환전`}
            layoutClassName="max-sm:w-[80vw] sm:w-96"
            contentClassName="max-h-[80vh]"
        >
            <S.TransferTypeBox>
                <button 
                    className={transferType === TransferTypes.TO_ACCOUNT ? "active" : ""}
                    onClick={() => {setTransferType(TransferTypes.TO_ACCOUNT)}}
                    onMouseEnter={() => {if (transferType === TransferTypes.TO_WALLET) setBgActive(true)}}
                    onMouseLeave={() => {setBgActive(false)}}
                >
                    <span>{`거래 지갑 -> 통장`}</span>
                    <i className="fa-solid fa-building-columns"></i>
                </button>
                <button 
                    className={transferType === TransferTypes.TO_WALLET ? "active" : ""}
                    onClick={() => {setTransferType(TransferTypes.TO_WALLET)}}
                    onMouseEnter={() => {if (transferType === TransferTypes.TO_ACCOUNT) setBgActive(true)}}
                    onMouseLeave={() => {setBgActive(false)}}
                >
                    <span>{`통장 -> 거래 지갑`}</span>
                    <i className="fa-brands fa-bitcoin"></i>
                </button>
                <div className={`thumb ${transferType === TransferTypes.TO_WALLET ? "right" : ""}`} />
                <div className={`absolute-center bg ${isBgActive ? "active" : ""}`} />
            </S.TransferTypeBox>

            <div className="flex flex-col w-full mt-4 space-y-6">
                <I.Input
                    label={`이체 금액`}
                    value={CommonUtils.textFormat(value, TextFormats.NUMBER)}
                    onChange={handleValue}
                    placeholder={`금액을 입력`}
                    className="h-10 px-4"
                    suffix={TransferSuffix[transferType]}
                    errorMessage={errorMessage}
                />

                {transferType === TransferTypes.TO_ACCOUNT && (
                    <S.TransferInfoList>
                        <S.TransferInfoBox>
                            <span className="label">지갑 잔액</span>
                            <span className="value">{CommonUtils.textFormat(balance, TextFormats.NUMBER)}W</span>
                        </S.TransferInfoBox>
                        <S.TransferInfoBox>
                            <span className="label">이체 후 통장 잔액</span>
                            <span className="value">{CommonUtils.textFormat(cash + value, TextFormats.NUMBER)}W</span>
                        </S.TransferInfoBox>
                    </S.TransferInfoList>
                )}
                {transferType === TransferTypes.TO_WALLET && (
                    <S.TransferInfoList>
                        <S.TransferInfoBox>
                            <span className="label">통장 잔액</span>
                            <span className="value">{CommonUtils.textFormat(cash, TextFormats.NUMBER)}W</span>
                        </S.TransferInfoBox>
                        <S.TransferInfoBox>
                            <span className="label">이체 후 지갑 잔액</span>
                            <span className="value">{CommonUtils.textFormat(balance + value, TextFormats.NUMBER)}W</span>
                        </S.TransferInfoBox>
                    </S.TransferInfoList>
                )}

                <S.TransferButton
                    onClick={() => {handleTransfer()}}
                    disabled={!isValid}
                >
                    이체하기
                </S.TransferButton>
            </div>
        </ModalLayout>
    )
}