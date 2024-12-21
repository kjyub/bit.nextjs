import { MarginModeType, OrderType } from "@/types/cryptos/CryptoTypes"
import * as S from "@/styles/CryptoTradeStyles"
import React, { useEffect, useRef, useState } from "react"
import { useMouseHover } from "@/hooks/useMouseHover"
import CommonUtils from "@/utils/CommonUtils"
import { TextFormats } from "@/types/CommonTypes"
import TypeUtils from "@/utils/TypeUtils"

const HelpBox = ({ children }: {children: React.ReactNode}) => {
    const [ref, isHover] = useMouseHover()
    return (
        <S.HelpBox ref={ref}>
            <i className="fa-solid fa-circle-question"></i>

            {children && (
                <div className={`w-fit ${isHover ? "show" : ""}`}>
                    {children}
                </div>
            )}
        </S.HelpBox>
    )
}

interface SlideInputProps {
    value: number
    setValue: (value: number) => void
    min: number
    max: number
    step?: number
    mark?: number | undefined
}
export const SlideInput = ({ value, setValue, min, max, step=1, mark=undefined }: SlideInputProps) => {
    const [marks, setMarks] = useState<number[]>([0, 100])

    useEffect(() => {
        if (mark) {
            // 눈금 설정
            const markCounts = Math.floor(max / mark)
            const markWidth = 100 / markCounts
            const _marks = Array.from({length: markCounts}, (_, i) => i * markWidth)
            setMarks([..._marks, 100])
        } else {
            setMarks([])
        }
    }, [mark, max])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value))
    }

    return (
        <S.Slider className="">
            <input 
                type="range" 
                className="w-full bg-transparent text-violet-600"
                min={min} 
                max={max}
                step={step} 
                value={value} 
                onChange={handleChange} 
            />
            <div className="absolute z-0 w-full h-full px-2">
                <div className="relative w-full h-full">
                    <S.SliderBar />
                    {marks.map((mark, idx) => (
                        <S.SliderMark key={idx} style={{left: `${mark}%`}} />
                    ))}
                </div>
            </div>
        </S.Slider>
    )
}

interface MarginModeInputProps {
    marginMode: MarginModeType
    setMarginMode: (mode: MarginModeType) => void
}
export const MarginModeInput = ({ marginMode, setMarginMode }: MarginModeInputProps) => {
    const [isBgActive, setBgActive] = useState<boolean>(false)

    return (
        <div className="flex items-center w-full h-7 space-x-4">
            <S.MarginModeBox> 
                <button 
                    className={marginMode === MarginModeType.CROSSED ? "active" : ""}
                    onClick={() => {setMarginMode(MarginModeType.CROSSED)}}
                    onMouseEnter={() => {if (marginMode === MarginModeType.ISOLATED) setBgActive(true)}}
                    onMouseLeave={() => {setBgActive(false)}}
                >
                    <i className="fa-solid fa-shuffle"></i>
                    <span>교차</span>
                </button>
                <button 
                    className={marginMode === MarginModeType.ISOLATED ? "active" : ""}
                    onClick={() => {setMarginMode(MarginModeType.ISOLATED)}}
                    onMouseEnter={() => {if (marginMode === MarginModeType.CROSSED) setBgActive(true)}}
                    onMouseLeave={() => {setBgActive(false)}}
                >
                    <i className="fa-solid fa-right-left"></i>
                    <span>격리</span>
                </button>
                <div className={`thumb ${marginMode === MarginModeType.ISOLATED ? "right" : ""}`} />
                <div className={`absolute-center bg ${isBgActive ? "active" : ""}`} />
            </S.MarginModeBox>

            <HelpBox>
                <div className="flex flex-col space-y-1 [&>label]:font-semibold">
                    <label>교차모드</label>
                    <span>투입한 자금과 지갑 내의 돈까지 사용</span>
                </div>
                <div className="flex flex-col space-y-1 [&>label]:font-semibold">
                    <label>격리모드</label>
                    <span>투입한 자금 내의 돈만 사용하여 손실 최소화</span>
                </div>
            </HelpBox>
        </div>
    )
}

interface LeverageInputProps {
    leverageRatio: number
    setLeverageRatio: (ratio: number) => void
    maxRatio?: number
}
export const LeverageInput = ({ leverageRatio, setLeverageRatio, maxRatio=75 }: LeverageInputProps) => {
    const [isInputFocus, setInputFocus] = useState<boolean>(false)

    // InputBox를 focus상태에서 다시 누르면 blur->focus가 되버리는 문제를 해결하기 위한 변수
    const inputValueMouseDownRef = useRef<boolean>(false) 
    const inputRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (CommonUtils.isNullOrUndefined(leverageRatio) || leverageRatio == 0) {
            setLeverageRatio(1)
        } else if (leverageRatio > maxRatio) {
            setLeverageRatio(maxRatio)
        }

        // 텍스트 입력 중이진 않은 경우에 editable div에 값을 새로 써준다
        if (inputRef.current && !isInputFocus) {
            inputRef.current.textContent = leverageRatio.toString()
        }
    }, [leverageRatio])

    const handleValue = (e: ChangeEvent<HTMLDivElement>) => {
        const value = parseInt(e.target.textContent)
        let _leverage = value
        let refreshValue = false // 입력하지 말아야 할 값이 들어온 경우 editable div에 값을 새로 써준다

        if (isNaN(value) || leverageRatio < 1) {
            _leverage = 1
            refreshValue = true
        } else if (value > maxRatio) {
            _leverage = maxRatio
            refreshValue = true
        }
        
        setLeverageRatio(_leverage)
        if (inputRef.current && refreshValue) {
            inputRef.current.textContent = _leverage.toString()
            
            // 커서를 맨 뒤로 이동
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(inputRef.current)
            range.collapse(false)
            selection?.removeAllRanges()
            selection?.addRange(range)
        }
    }

    return (
        <div className="flex flex-col w-full space-y-2">
            <div className="flex justify-between items-center w-full h-9">
                <div className="flex items-center space-x-2">
                    <S.Title>레버리지</S.Title>
                    <span className="font-light text-sm text-slate-500">
                        {`1x ~ ${maxRatio}x`}
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <S.InputBox 
                        className="ml-auto items-center w-[46px]"
                        onClick={() => {inputRef.current?.focus()}}
                        onMouseDown={() => {inputValueMouseDownRef.current = true}}
                        onMouseUp={() => {inputValueMouseDownRef.current = false}}
                        $is_focus={isInputFocus}
                    >
                        <div
                            className="input"
                            contentEditable={true}
                            ref={inputRef}
                            onInput={handleValue}
                            onFocus={() => {setInputFocus(true)}}
                            onBlur={(e) => {
                                if (inputValueMouseDownRef.current) return
                                setInputFocus(false)
                            }}
                        />
                        <span className="text-xs text-slate-400 ml-0.5 mt-0.5 select-none">x</span>
                    </S.InputBox>
                    <HelpBox>
                        <div className="flex flex-col space-y-1 [&>label]:font-semibold">
                            <label>레버리지</label>
                            <span>수량을 배율만큼 더 빌려서 구매한다</span>
                        </div>
                    </HelpBox>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <SlideInput 
                    value={leverageRatio}
                    setValue={setLeverageRatio}
                    min={1}
                    max={maxRatio}
                    step={1}
                    mark={25}
                />
            </div>
        </div>
    )
}

interface OrderTypeInputProps {
    orderType: OrderType
    setOrderType: (mode: OrderType) => void
}
export const OrderTypeInput = ({ orderType, setOrderType }: OrderTypeInputProps) => {
    return (
        <div className="flex items-center w-full h-7 space-x-4">
            <S.OrderTypeBox> 
                <button 
                    className={orderType === OrderType.LIMIT ? "active" : ""}
                    onClick={() => {setOrderType(OrderType.LIMIT)}}
                >
                    <span>지정가</span>
                </button>
                <button 
                    className={orderType === OrderType.MARKET ? "active" : ""}
                    onClick={() => {setOrderType(OrderType.MARKET)}}
                >
                    <span>시장가</span>
                </button>
            </S.OrderTypeBox>

            {/* <HelpBox>
                <div className="flex flex-col space-y-1 [&>label]:font-semibold">
                    <label>지정가</label>
                    <span>투입한 자금과 지갑 내의 돈까지 사용</span>
                </div>
                <div className="flex flex-col space-y-1 [&>label]:font-semibold">
                    <label>시장가</label>
                    <span>투입한 자금 내의 돈만 사용하여 손실 최소화</span>
                </div>
            </HelpBox> */}
        </div>
    )
}

interface NumberInputProps {
    label: string
    value: number
    setValue: (value: number) => void
    min?: number
    max?: number | undefined
    className?: string
}
export const NumberInput = ({ label, value, setValue, min=0, max=undefined, className="" }: NumberInputProps) => {
    const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
        const replaceComma = e.target.value.replace(/,/g, "")
        const _value = Number(replaceComma)
        if (isNaN(_value)) return

        if (max && _value > max) {
            setValue(max)
        } else if (_value < min) {
            setValue(min)
        } else {
            setValue(_value)
        }
    }
    
    return (
        <S.InputBox className={`justify-between h-8 space-x-2 ${className}`}>
            <span className="font-light text-sm text-slate-400/80 text-nowrap select-none">{label}</span>
            <input 
                className="input text-right"
                value={CommonUtils.textFormat(value, TextFormats.NUMBER)} 
                onChange={handleValue}
                min={min}
                max={max}
            />
        </S.InputBox>
    )
}

interface LimitAmountInputProps {
    amount: number
    setAmount: (amount: number) => void
    maxAmount: number
}
export const LimitAmountInput = ({ amount, setAmount, maxAmount }: LimitAmountInputProps) => {
    return (
        <div className="flex flex-col w-full space-y-2">
            <NumberInput 
                label={"수량"}
                value={amount}
                setValue={setAmount}
            />
            <div className="flex items-center px-2 space-x-2">
                <span className="font-light text-xs text-slate-400/80 w-12">
                    {`수량(잔고)`}
                </span>
                <div className="flex-1">
                    <SlideInput value={amount} setValue={setAmount} min={0} max={maxAmount} step={maxAmount/100} />
                </div>
                <span className="font-light text-xs text-slate-400/80 text-right w-6">
                    {TypeUtils.percent((amount/maxAmount), 1)}
                </span>
            </div>
        </div>
    )
}

interface LimitPriceInputProps {
    price: number
    setPrice: (price: number) => void
    initPrice: () => void
}
export const LimitPriceInput = ({ price, setPrice, initPrice }: LimitPriceInputProps) => {
    return (
        <div className={`flex w-full justify-between`}>
            <div className="w-[calc(100%-24px)]">
                <NumberInput 
                    label={"가격"}
                    value={price}
                    setValue={setPrice}
                />
            </div>
            <button 
                className="text-sm text-slate-500 hover:text-slate-400"
                onClick={() => {initPrice()}}
            >
                <i className="fa-solid fa-rotate-right"></i>
            </button>
        </div>
    )
}


interface MarketPriceInputProps {
    targetPrice: number
    setTargetPrice: (targetPrice: number) => void
    userBudget: number
}
export const MarketPriceInput = ({ targetPrice, setTargetPrice, userBudget }: MarketPriceInputProps) => {
    return (
        <div className="flex flex-col w-full space-y-2">
            <NumberInput 
                label={"총액"}
                value={targetPrice}
                setValue={setTargetPrice}
            />
            <div className="flex items-center px-2 space-x-2">
                <span className="font-light text-xs text-slate-400/80 w-12">
                    {`총액(잔고)`}
                </span>
                <div className="flex-1">
                    <SlideInput value={targetPrice} setValue={setTargetPrice} min={0} max={userBudget} step={userBudget/100} />
                </div>
                <span className="font-light text-xs text-slate-400/80 text-right w-6">
                    {TypeUtils.percent((targetPrice/userBudget), 1)}
                </span>
            </div>
        </div>
    )
}

export const TpSlLayout = ({ children }: {children: React.ReactNode}) => {
    const [isShow, setShow] = useState<boolean>(false)

    return (
        <div className="flex flex-col w-full space-y-2">
            <div className="flex justify-between items-center w-full">
                <S.Title2>TP/SL</S.Title2>

                <div className="flex space-x-2">
                    <button
                        className={`${isShow ? "text-violet-500" : "text-slate-500"} transition-colors`}
                        onClick={() => {setShow(!isShow)}}
                    >
                        {isShow ? (
                            <i className="fa-solid fa-square-check"></i>
                        ) : (
                            <i className="fa-solid fa-square"></i>
                        )}
                    </button>

                    <HelpBox>
                        <div className="flex flex-col space-y-1 [&>label]:font-semibold">
                            <label>TP (Take Profit)</label>
                            <span>투입한 자금과 지갑 내의 돈까지 사용</span>
                        </div>
                        <div className="flex flex-col space-y-1 [&>label]:font-semibold">
                            <label>SL (Stop Loss)</label>
                            <span>투입한 자금 내의 돈만 사용하여 손실 최소화</span>
                        </div>
                    </HelpBox>
                </div>
            </div>
            
            {isShow && (
                <div className="flex flex-col w-full space-y-1">
                    {children}
                </div>
            )}
        </div>
    )
}