"use client"

import * as S from "@/styles/CryptoTradeStyles"
import * as I from "@/components/inputs/TradeInputs"
import { MarginModeType, OrderType, PositionType, SizeUnitTypes, TradeType } from "@/types/cryptos/CryptoTypes"
import { useCallback, useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import { TextFormats } from "@/types/CommonTypes"
import TypeUtils from "@/utils/TypeUtils"
import useUserInfoStore from "@/store/useUserInfo"
import CryptoApi from "@/apis/api/cryptos/CryptoApi"
import { useUser } from "@/hooks/useUser"
import User from "@/types/users/User"
import { CryptoFee } from "@/types/cryptos/CryptoConsts"

const R = 0.005 // 유지 증거금률

interface ICryptoMarketTrade {
    user: User
    marketCode: string
    marketPrice: number
    unit: string
    sizeUnitType: SizeUnitTypes
    setSizeUnitType: (type: SizeUnitTypes) => void
}
export default function CryptoMarketTrade({ 
    user, 
    marketCode, 
    marketPrice, 
    unit,
    sizeUnitType,
    setSizeUnitType
}: ICryptoMarketTrade) {
    const { balance, updateInfo } = useUserInfoStore()
    const userBudget = balance
    
    const [marginMode, setMarginMode] = useState<MarginModeType>(MarginModeType.CROSSED) // 마진모드 (CROSSED, ISOLATED)
    const [leverageRatio, setLeverageRatio] = useState<number>(1) // 레버리지 비율
    const [orderType, setOrderType] = useState<OrderType>(OrderType.LIMIT) // 지정가/시장가
    const [price, setPrice] = useState<number>(0) // 구매가
    const [quantity, setQuantity] = useState<number>(0) // 구매 수량
    const [cost, setCost] = useState<number>(0) // 구매 비용
    const [size, setSize] = useState<number>(0) // 레버리지 포함 크기
    const [takeProfit, setTakeProfit] = useState<number>(0)
    const [stopLoss, setStopLoss] = useState<number>(0)
    const [fee, setFee] = useState<number>(CryptoFee.MAKER) // 구매 수수료

    const [buyPrice, setBuyPrice] = useState<number>(0) // 총 구매 가격
    const [liqLongPrice, setLiqLongPrice] = useState<number>(0) // 청산가 (롱)
    const [liqShortPrice, setLiqShortPrice] = useState<number>(0) // 청산가 (숏)

    useEffect(() => {
        initPrice()
        
        if (!CommonUtils.isStringNullOrEmpty(user.uuid)) {
            updateInfo()
        }
    }, [marketCode, user.uuid])

    useEffect(() => {
        setLiqLongPrice(price * (1 - (1/leverageRatio) + R))
        setLiqShortPrice(price * (1 + (1/leverageRatio) - R))
    }, [price, leverageRatio])

    useEffect(() => {
        setSize(cost * leverageRatio)
    }, [leverageRatio])

    useEffect(() => {
        if (orderType === OrderType.MARKET) {
            setPrice(marketPrice)
            setFee(CryptoFee.TAKER)
        } else if (orderType === OrderType.LIMIT) {
            setFee(CryptoFee.MAKER)
        }
    }, [orderType, marketPrice])

    const initPrice = () => {
        setPrice(marketPrice)
    }

    const handleTrade = useCallback(async (_positionType: PositionType) => {
        if (CommonUtils.isStringNullOrEmpty(user.uuid)) {
            alert("로그인이 필요합니다.")
            return
        }

        let errorMessages: Array<string> = []
        if (cost <= 0) {
            errorMessages.push("거래수량을 입력해주세요.")
        }
        if (price <= 0) {
            errorMessages.push("거래 가격을 입력해주세요.")
        }
        if (leverageRatio <= 0) {
            errorMessages.push("레버리지를 입력해주세요.")
        }
        if (errorMessages.length > 0) {
            alert(errorMessages.join("\n"))
            return
        }

        const data = {
            market_code: marketCode,
            trade_type: TradeType.OPEN,
            margin_mode: marginMode,
            position_type: _positionType,
            cost: cost,
            price: price,
            quantity: quantity,
            size: size,
            leverage: leverageRatio,
            size_unit_type: sizeUnitType,
        }
        console.log(data)
        
        let result = false
        if (orderType === OrderType.LIMIT) {
            result = await CryptoApi.orderLimit(data)
        } else if (orderType === OrderType.MARKET) {
            result = await CryptoApi.orderMarket(data)
        }
        
        if (result) {
            alert("거래가 성공적으로 완료되었습니다.")
            updateInfo()
        } else {
            alert("거래에 실패하였습니다.")
        }
    }, [user, marginMode, orderType, marketCode, cost, price, quantity, size, leverageRatio, sizeUnitType])

    return (
        <S.TradeBox>
            <I.MarginModeInput marginMode={marginMode} setMarginMode={setMarginMode} />

            <I.LeverageInput
                leverageRatio={leverageRatio}
                setLeverageRatio={setLeverageRatio}
                maxRatio={75}
            />
            <div className="!mt-6 !mb-1 border-b border-slate-600/30" />
            <I.OrderTypeInput orderType={orderType} setOrderType={setOrderType} />
            
            {orderType === OrderType.LIMIT && (
                <>
                    <I.LimitPriceInput 
                        price={price}
                        setPrice={setPrice}
                        initPrice={initPrice}
                    />
                    <I.TradeSizeInput 
                        size={size}
                        setQuantity={setQuantity}
                        setSize={setSize}
                        userBudget={userBudget}
                        setCost={setCost}
                        leverage={leverageRatio}
                        price={price}
                        fee={fee}
                        unit={unit}
                        sizeUnitType={sizeUnitType}
                        setSizeUnitType={setSizeUnitType}
                    />
                </>
            )}

            {orderType === OrderType.MARKET && (
                <>
                    <I.TradeSizeInput 
                        size={size}
                        setQuantity={setQuantity}
                        setSize={setSize}
                        userBudget={userBudget}
                        setCost={setCost}
                        leverage={leverageRatio}
                        price={price}
                        fee={fee}
                        unit={unit}
                        sizeUnitType={sizeUnitType}
                        setSizeUnitType={setSizeUnitType}
                    />
                </>
            )}

            <I.TpSlLayout>
                <I.NumberInput 
                    label={"TP"}
                    value={takeProfit}
                    setValue={setTakeProfit}
                />
                <I.NumberInput 
                    label={"SL"}
                    value={stopLoss}
                    setValue={setStopLoss}
                />
            </I.TpSlLayout>

            <div className="flex flex-col w-full space-y-1 !mt-auto">
                {/* <S.Title2>정보</S.Title2> */}
                <S.SummaryItem>
                    <span className="label">현재 잔액</span>
                    <span className="value">{CommonUtils.textFormat(userBudget, TextFormats.NUMBER)}</span>
                </S.SummaryItem>
                <S.SummaryItem>
                    <span className="label">구매 비용</span>
                    <span className="value">{CommonUtils.textFormat(cost, TextFormats.NUMBER)}</span>
                </S.SummaryItem>
                <S.SummaryItem>
                    <span className="label">청산가 (롱)</span>
                    <span className="value">{CommonUtils.textFormat(liqLongPrice, TextFormats.NUMBER)}</span>
                </S.SummaryItem>
                <S.SummaryItem>
                    <span className="label">청산가 (숏)</span>
                    <span className="value">{CommonUtils.textFormat(liqShortPrice, TextFormats.NUMBER)}</span>
                </S.SummaryItem>
                <S.SummaryItem>
                    <span className="label">수수료</span>
                    <span className="value">{TypeUtils.percent(fee, 3)}</span>
                </S.SummaryItem>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
                <S.TradeLongButton
                    onClick={() => {handleTrade(PositionType.LONG)}}
                >
                    매수/롱
                </S.TradeLongButton>
                <S.TradeShortButton
                    onClick={() => {handleTrade(PositionType.SHORT)}}
                >
                    매도/숏
                </S.TradeShortButton>
            </div>
        </S.TradeBox>
    )
}

