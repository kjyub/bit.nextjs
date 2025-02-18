import { MarginModeType, MarginModeTypeValues, TradeOrderType, SizeUnitTypes, TradeOrderTypeValues, SizeUnitTypeValues } from "@/types/cryptos/CryptoTypes"
import * as S from "@/styles/CryptoTradeStyles"
import React, { useEffect, useRef, useState } from "react"
import { useMouseHover } from "@/hooks/useMouseHover"
import CommonUtils from "@/utils/CommonUtils"
import { TextFormats } from "@/types/CommonTypes"
import TypeUtils from "@/utils/TypeUtils"
import { useDetectClose } from "@/hooks/useDetectClose"

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
    // console.log(min, max, step)

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
    marginMode: MarginModeTypeValues
    setMarginMode: (mode: MarginModeTypeValues) => void
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
    orderType: TradeOrderTypeValues
    setOrderType: (mode: TradeOrderTypeValues) => void
}
export const OrderTypeInput = ({ orderType, setOrderType }: OrderTypeInputProps) => {
    return (
        <div className="flex items-center w-full h-6 space-x-4">
            <S.OrderTypeBox> 
                <button 
                    className={orderType === TradeOrderType.LIMIT ? "active" : ""}
                    onClick={() => {setOrderType(TradeOrderType.LIMIT)}}
                >
                    <span>지정가</span>
                </button>
                <button 
                    className={orderType === TradeOrderType.MARKET ? "active" : ""}
                    onClick={() => {setOrderType(TradeOrderType.MARKET)}}
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
    suffix?: string
}
export const NumberInput = ({ label, value, setValue, min=0, max=undefined, className="", suffix="" }: NumberInputProps) => {
    const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
        const replaceComma = String(e.target.value.replace(/,/g, ""))

        if (replaceComma === "") {
            setValue()
            return
        }

        const _value = parseFloat(replaceComma)
        if (isNaN(_value)) return

        // 소수점 입력하는 경우 1
        if (replaceComma[replaceComma.length-1] === ".") {
            setValue(replaceComma)
            return
        }
        // 소수점 입력하는 경우 2
        if (replaceComma.includes(".") && replaceComma[replaceComma.length-1] == "0") {
            setValue(replaceComma)
            return
        }

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
                className="input text-right w-full"
                value={CommonUtils.textFormat(value, TextFormats.NUMBER)} 
                // value={value}
                onChange={handleValue}
                min={min}
                max={max}
            />
            {!CommonUtils.isStringNullOrEmpty(suffix) && (
                <span className="ml-0.5! input text-slate-400!">{suffix}</span>
            )}
        </S.InputBox>
    )
}

interface LimitSizeInputProps {
    amount: number
    setAmount: (amount: number) => void
    maxAmount: number
}
export const LimitSizeInput = ({ amount, setAmount, maxAmount }: LimitSizeInputProps) => {
    const stepValue = maxAmount / 100
    const step = isNaN(stepValue) ? 1 : stepValue

    const percentValue = amount / maxAmount
    const percent = isNaN(percentValue) ? 0 : percentValue

    return (
        <div className="flex flex-col w-full space-y-2">
            <NumberInput 
                label={"크기"}
                value={amount}
                setValue={setAmount}
            />
            <div className="flex items-center px-2 space-x-2">
                <span className="font-light text-xs text-slate-400/80 w-12">
                    {`크기`}
                </span>
                <div className="flex-1">
                    <SlideInput value={amount} setValue={setAmount} min={0} max={maxAmount} step={step} />
                </div>
                <span className="font-light text-xs text-slate-400/80 text-right w-6">
                    {TypeUtils.percent((percent), 1)}
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
                className="w-4 text-sm text-slate-500 hover:text-slate-400"
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
    const percentValue = targetPrice / userBudget
    const percent = isNaN(percentValue) ? 0 : percentValue

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
                    {TypeUtils.percent((percent), 1)}
                </span>
            </div>
        </div>
    )
}


interface TradeSizeInputProps {
    size: number
    setQuantity: (quantity: number) => void
    setSize: (size: number) => void
    setCost: (cost: number) => void
    userBudget: number
    unit: string
    leverage: number
    price: number
    fee: number
    sizeUnitType: SizeUnitTypeValues
    setSizeUnitType: (unit: SizeUnitTypeValues) => void
}
export const TradeSizeInput = ({ size, setQuantity, setSize, userBudget, setCost, unit, leverage, price, fee, sizeUnitType, setSizeUnitType }: TradeSizeInputProps) => {
    const [isPercent, setIsPercent] = useState<boolean>(false)
    
    // 여기서 사용되는 값
    const [percentValue, setPercentValue] = useState<number>(0) // 자산 비율
    const [sizeValue, setSizeValue] = useState<number>(0) // 레버리지를 곱한 총 구매 크기
    const [quantityValue, setQuantityValue] = useState<number>(0) // 레버리지를 곱한 총 구매 수량

    useEffect(() => {
        setQuantity(0)
        setSize(0)

        setPercentValue(0)
        setSizeValue(0)
        setQuantityValue(0)
    }, [isPercent, sizeUnitType])

    const handlePercent = (_percentValue: number) => {
        if (!isPercent) {
            return
        }

        const _size = Math.floor(userBudget * (_percentValue / 100))
        setSize(_size * leverage)
        setCost(_size)

        setPercentValue(_percentValue)
    }

    const handleSize = (_size: number) => {
        if (isPercent) {
            return
        }

        setSize(_size * leverage)
        setCost(_size)

        setSizeValue(_size)
    }

    const handleQuantity = (_quantity: number) => {
        if (isPercent) {
            return
        }
        // _quantity엔 이미 레버리지 포함되어있음

        setQuantity(_quantity)
        setSize(_quantity * price)
        setCost((_quantity * price) / leverage)

        setQuantityValue(_quantity)
    }

    return (
        <div className="flex flex-col w-full space-y-2">
            {/* 숫자 입력 */}
            <div 
                className="flex justify-between items-center w-full [&>div]:w-[calc(100%-24px)]" 
                onMouseDown={() => {setIsPercent(false)}} 
                onFocus={() => {setIsPercent(false)}}
            >
                {!isPercent ? (
                    sizeUnitType === SizeUnitTypes.PRICE ? (
                        <NumberInput 
                            label={"크기"}
                            value={sizeValue}
                            setValue={handleSize}
                            max={userBudget}
                            suffix={"TW"}
                        />
                    ) : (
                        <NumberInput 
                            label={"크기"}
                            value={quantityValue}
                            setValue={handleQuantity}
                            max={(userBudget / price) * leverage}
                            suffix={unit}
                        />
                    )
                ) : (
                    <NumberInput 
                        label={"크기"}
                        value={percentValue}
                        setValue={handlePercent}
                        max={100}
                        suffix={"%"}
                    />
                )}

                <button 
                    className="w-4 text-sm text-slate-500 hover:text-slate-400"
                    onClick={() => {setSizeUnitType(sizeUnitType === SizeUnitTypes.PRICE ? SizeUnitTypes.QUANTITY : SizeUnitTypes.PRICE)}}
                >
                    <i className="fa-solid fa-arrows-rotate"></i>
                </button>
            </div>

            {/* 자산 비율 슬라이더 */}
            <div className="flex items-center pl-2 space-x-0">
                <span className="font-light text-xs text-slate-400/80 w-12">
                    자산 비율
                </span>
                <div className="flex-1" onMouseDown={() => {setIsPercent(true)}}>
                    <SlideInput value={percentValue} setValue={handlePercent} min={0} max={100} step={1} mark={100} />
                </div>
            </div>
            
            {/* 총 크기 */}
            <div className="flex justify-between items-center w-full [&>span]:px-1 [&>span]:text-[11px] [&>span]:text-slate-300/90 [&>span]:truncate">
                {sizeUnitType === SizeUnitTypes.PRICE && (
                    <>
                        <span className="border-l-2 border-position-long-3" title="롱 포지션 크기">
                            {`${CommonUtils.textFormat(TypeUtils.round(size * (1-fee), 4), TextFormats.KOREAN_PRICE)}TW`}
                        </span>
                        <span className="border-r-2 border-position-short-3" title="숏 포지션 크기">
                            {`${CommonUtils.textFormat(TypeUtils.round(size * (1-fee), 4), TextFormats.KOREAN_PRICE)}TW`}
                        </span>
                    </>
                )}
                {sizeUnitType === SizeUnitTypes.QUANTITY && (
                    <>
                        <span className="border-l-2 border-position-long-3" title="롱 포지션 크기">
                            {`${CommonUtils.textFormat(TypeUtils.round((size * (1-fee)) / price, 10), TextFormats.NUMBER)}${unit}`}
                        </span>
                        <span className="border-r-2 border-position-short-3" title="숏 포지션 크기">
                            {`${CommonUtils.textFormat(TypeUtils.round((size * (1-fee)) / price, 10), TextFormats.NUMBER)}${unit}`}
                        </span>
                    </>
                )}
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

interface PositionCloseSizeInputProps {
    label: string
    value: number
    setValue: (value: number) => void
    max: number
}
export const PositionCloseSizeInput = ({ label, value, setValue, max }: PositionCloseSizeInputProps) => {
    const [ref, isSliderShow, setSliderShow] = useDetectClose()

    useEffect(() => {
        if (ref.current && ref.current.querySelector("input.input")) {
            const closeSizeInput = ref.current.getElementsByClassName("close-size-input")[0]
            
            const handler = (e: MouseEvent) => {
                setSliderShow(true)
            }
            closeSizeInput.addEventListener("click", handler)

            return () => {
                closeSizeInput.removeEventListener("click", handler)
            }
        }
    }, [])

    return (
        <div ref={ref} className="relative w-full h-8">
            <NumberInput label={label} value={value} setValue={setValue} max={max} className="close-size-input"  />

            {isSliderShow && (
                <div className="absolute top-10 right-0 flex items-center w-[90%] h-9 px-3 space-x-2 rounded-lg bg-slate-800 border border-slate-700 shadow-lg">
                    <div className="flex-1">
                        <SlideInput value={value} setValue={setValue} min={0} max={max} step={max/100} mark={max/4} />
                    </div>
                    <span className="font-light text-xs text-slate-400 text-right w-6 pr-1">
                        {TypeUtils.percent((value/max), 1)}
                    </span>
                </div>
            )}
        </div>
    )
}