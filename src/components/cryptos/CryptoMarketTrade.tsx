"use client"

import * as S from "@/styles/CryptoTradeStyles"
import * as I from "@/components/inputs/TradeInputs"
import { MarginModeType, OrderType } from "@/types/cryptos/CryptoTypes"
import { useEffect, useState } from "react"
import CommonUtils from "@/utils/CommonUtils"
import { TextFormats } from "@/types/CommonTypes"
import TypeUtils from "@/utils/TypeUtils"

const R = 0.005 // 유지 증거금률

interface ICryptoMarketTrade {
    marketCode: string
    marketPrice: number
}
export default function CryptoMarketTrade({ marketCode, marketPrice }: ICryptoMarketTrade) {
    const [marginMode, setMarginMode] = useState<MarginModeType>(MarginModeType.CROSSED)
    const [leverageRatio, setLeverageRatio] = useState<number>(1)
    const [orderType, setOrderType] = useState<OrderType>(OrderType.LIMIT)
    const [amount, setAmount] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    const [takeProfit, setTakeProfit] = useState<number>(0)
    const [stopLoss, setStopLoss] = useState<number>(0)
    const [targetPrice, setTargetPrice] = useState<number>(0) // 시장가 주문시 사용

    const [userBudget, setUserBudget] = useState<number>(4954007)
    const [maxAmount, setMaxAmount] = useState<number>(0)

    const [buyPrice, setBuyPrice] = useState<number>(0) // 총 구매 가격
    const [liqLongPrice, setLiqLongPrice] = useState<number>(0) // 청산가 (롱)
    const [liqShortPrice, setLiqShortPrice] = useState<number>(0) // 청산가 (숏)

    useEffect(() => {
        initPrice()
    }, [])

    useEffect(() => {
        setMaxAmount(userBudget / price)
    }, [maxAmount, price])

    useEffect(() => {
        if (orderType === OrderType.MARKET) {
            setBuyPrice(targetPrice)
        } else if (orderType === OrderType.LIMIT) {
            setBuyPrice(Math.ceil(price * amount))
        }
    }, [price, amount, orderType, targetPrice])

    useEffect(() => {
        setLiqLongPrice(buyPrice * (1 - (1/leverageRatio) + R))
        setLiqShortPrice(buyPrice * (1 + (1/leverageRatio) - R))
    }, [buyPrice, leverageRatio])

    const initPrice = () => {
        setPrice(marketPrice)
    }


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
                    <I.LimitAmountInput 
                        amount={amount}
                        setAmount={setAmount}
                        maxAmount={maxAmount}
                    />
                    <I.LimitPriceInput 
                        price={price}
                        setPrice={setPrice}
                        initPrice={initPrice}
                    />
                </>
            )}

            {orderType === OrderType.MARKET && (
                <>
                    <I.MarketPriceInput 
                        targetPrice={targetPrice}
                        setTargetPrice={(_p) => {setTargetPrice(Math.floor(_p))}}
                        userBudget={userBudget}
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
                <S.Title2>정보</S.Title2>
                <S.SummaryItem>
                    <span className="label">현재 잔액</span>
                    <span className="value">{CommonUtils.textFormat(userBudget, TextFormats.NUMBER)}</span>
                </S.SummaryItem>
                <S.SummaryItem>
                    <span className="label">구매 가격</span>
                    <span className="value">{CommonUtils.textFormat(buyPrice, TextFormats.NUMBER)}</span>
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
                    <span className="value">{TypeUtils.percent(R, 3)}</span>
                </S.SummaryItem>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
                <S.TradeLongButton>
                    매수/롱
                </S.TradeLongButton>
                <S.TradeShortButton>
                    매도/숏
                </S.TradeShortButton>
            </div>
        </S.TradeBox>
    )
}