"use client"

import dayjs from "dayjs"
import { useEffect, useState } from "react"
import * as S from "@/styles/CryptoMyTradeStyles"
import CommonUtils from "@/utils/CommonUtils"

enum DateType {
    NONE = "none",
    DAY = "1d",
    WEEK = "1w",
    MONTH1 = "1M",
    MONTH3 = "3M",
}

interface ICryptoMyTradeFilter {
    onSearch: (dateStart: string, dateEnd: string, marketSearch: string) => void
}
export default function CryptoMyTradeFilter({
    onSearch
}: ICryptoMyTradeFilter) {
    const [dateStart, setDateStart] = useState<string>("")
    const [dateEnd, setDateEnd] = useState<string>("")
    const [marketSearch, setMarketSearch] = useState<string>("")

    const [dateType, setDateType] = useState<DateType>(DateType.DAY)

    useEffect(() => {
        const today = dayjs()
        const yesterday = today.subtract(1, "day")
        setDateStart(yesterday.format("YYYY-MM-DD"))
        setDateEnd(today.format("YYYY-MM-DD"))
    }, [])

    useEffect(() => {
        const today = dayjs()
        if (today.format("YYYY-MM-DD") !== dateEnd) {
            setDateType(DateType.NONE)
        } else {
            if (today.subtract(1, "day").format("YYYY-MM-DD") === dateStart) {
                setDateType(DateType.DAY)
            } else if (today.subtract(1, "week").format("YYYY-MM-DD") === dateStart) {
                setDateType(DateType.WEEK)
            } else if (today.subtract(1, "month").format("YYYY-MM-DD") === dateStart) {
                setDateType(DateType.MONTH1)
            } else if (today.subtract(3, "month").format("YYYY-MM-DD") === dateStart) {
                setDateType(DateType.MONTH3)
            } else {
                setDateType(DateType.NONE)
            }
        }
    }, [dateStart, dateEnd])

    const handleDateType = (_dateType: DateType) => {
        const today = dayjs()

        if (_dateType === DateType.DAY) {
            const yesterday = today.subtract(1, "day")
            setDateStart(yesterday.format("YYYY-MM-DD"))
        } else if (_dateType === DateType.WEEK) {
            const lastWeek = today.subtract(1, "week")
            setDateStart(lastWeek.format("YYYY-MM-DD"))
        } else if (_dateType === DateType.MONTH1) {
            const lastMonth = today.subtract(1, "month")
            setDateStart(lastMonth.format("YYYY-MM-DD"))
        } else if (_dateType === DateType.MONTH3) {
            const last3Month = today.subtract(3, "month")
            setDateStart(last3Month.format("YYYY-MM-DD"))
        }

        setDateEnd(today.format("YYYY-MM-DD"))
    }

    const handleSearch = () => {
        onSearch(dateStart, dateEnd, marketSearch)
    }
    
    return (
        <div className="flex items-center mb-1 [&>.split]:h-4 [&>.split]:border-l [&>.split]:border-slate-700">
            <S.FilterButton $is_active={dateType === DateType.DAY} onClick={() => handleDateType(DateType.DAY)}>
                1일
            </S.FilterButton>
            <S.FilterButton $is_active={dateType === DateType.WEEK} onClick={() => handleDateType(DateType.WEEK)}>
                1주
            </S.FilterButton>
            <S.FilterButton $is_active={dateType === DateType.MONTH1} onClick={() => handleDateType(DateType.MONTH1)}>
                1개월
            </S.FilterButton>
            <S.FilterButton $is_active={dateType === DateType.MONTH3} onClick={() => handleDateType(DateType.MONTH3)}>
                3개월
            </S.FilterButton>
            <div className="split"></div>
            <div className="flex items-center px-2 space-x-1 [&>span]:text-xs [&>span]:text-slate-400">
                <span>날짜</span>
                <Date date={dateStart} setDate={setDateStart} />
                <span>~</span>
                <Date date={dateEnd} setDate={setDateEnd} />
            </div>

            <S.FilterButton onClick={handleSearch} $is_active={true} className="font-medium">
                검색
            </S.FilterButton>
        </div>
    )
}

interface IDate {
    date: string
    setDate: (date: string) => void
}
const Date = ({ date, setDate }: IDate) => {
    const [year, setYear] = useState<string>("")
    const [month, setMonth] = useState<string>("")
    const [day, setDay] = useState<string>("")

    useEffect(() => {
        if (!dayjs(date).isValid()) {
            return
        }
        
        setYear(Number(date.split("-")[0]))
        setMonth(Number(date.split("-")[1]))
        setDay(Number(date.split("-")[2]))
    }, [date])

    const handleYear = (year: number) => {
        if (!CommonUtils.isStringNullOrEmpty(year) && (isNaN(Number(year)) || Number(year) < 0 || Number(year) > 2100)) return

        const _date = `${year}-${month}-${day}`
        if (dayjs(_date).isValid()) {
            setDate(_date);
        }
    }
    const handleMonth = (month: number) => {
        if (!CommonUtils.isStringNullOrEmpty(month) && (isNaN(Number(month)) || Number(month) < 0 || Number(month) > 12)) return

        const _date = `${year}-${month}-${day}`
        if (dayjs(_date).isValid()) {
            setDate(_date);
        }
    }
    const handleDay = (day: number) => {
        if (!CommonUtils.isStringNullOrEmpty(day) && (isNaN(Number(day)) || Number(day) < 0 || Number(day) > 31)) return

        const _date = `${year}-${month}-${day}`
        if (dayjs(_date).isValid()) {
            setDate(_date);
        }
    }

    return (
        <S.FilterDateInputBox>
            <input
                type="text"
                className="w-[28px]"
                value={year}
                onChange={(e) => handleYear(e.target.value)}
            />
            <span>-</span>
            <input
                type="text"
                className="w-4"
                value={month}
                onChange={(e) => handleMonth(e.target.value)}
            />
            <span>-</span>
            <input
                type="text"
                className="w-4"
                value={day}
                onChange={(e) => handleDay(e.target.value)}
            />
        </S.FilterDateInputBox>
    )
}