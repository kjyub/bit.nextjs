'use client';

import * as S from '@/styles/CryptoMyTradeStyles';
import DateUtils from '@/utils/DateUtils';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

enum DateType {
  NONE = 'none',
  DAY = '1d',
  WEEK = '1w',
  MONTH1 = '1M',
  MONTH3 = '3M',
}

interface ICryptoMyTradeFilter {
  onSearch: (dateStart: string, dateEnd: string, marketSearch: string) => void;
  isInitSearch?: boolean;
}
export default function CryptoMyTradeFilter({ onSearch, isInitSearch = true }: ICryptoMyTradeFilter) {
  const today = useMemo(() => dayjs(), []);
  const yesterday = useMemo(() => today.subtract(1, 'day'), []);

  const [dateStart, setDateStart] = useState<string>(yesterday.format('YYYY-MM-DD'));
  const [dateEnd, setDateEnd] = useState<string>(today.format('YYYY-MM-DD'));
  const [marketSearch, _setMarketSearch] = useState<string>('');

  const [dateType, setDateType] = useState<DateType>(DateType.DAY);

  useEffect(() => {
    if (isInitSearch) {
      onSearch(dateStart, dateEnd, marketSearch);
    }
  }, []);

  useEffect(() => {
    const today = dayjs();
    if (today.format('YYYY-MM-DD') !== dateEnd) {
      setDateType(DateType.NONE);
    } else {
      if (today.subtract(1, 'day').format('YYYY-MM-DD') === dateStart) {
        setDateType(DateType.DAY);
      } else if (today.subtract(1, 'week').format('YYYY-MM-DD') === dateStart) {
        setDateType(DateType.WEEK);
      } else if (today.subtract(1, 'month').format('YYYY-MM-DD') === dateStart) {
        setDateType(DateType.MONTH1);
      } else if (today.subtract(3, 'month').format('YYYY-MM-DD') === dateStart) {
        setDateType(DateType.MONTH3);
      } else {
        setDateType(DateType.NONE);
      }
    }
  }, [dateStart, dateEnd]);

  const handleDateType = (_dateType: DateType) => {
    const today = dayjs();

    let _startDate = '';
    const _endDate = today.format('YYYY-MM-DD');

    if (_dateType === DateType.DAY) {
      const yesterday = today.subtract(1, 'day');
      _startDate = yesterday.format('YYYY-MM-DD');
    } else if (_dateType === DateType.WEEK) {
      const lastWeek = today.subtract(1, 'week');
      _startDate = lastWeek.format('YYYY-MM-DD');
    } else if (_dateType === DateType.MONTH1) {
      const lastMonth = today.subtract(1, 'month');
      _startDate = lastMonth.format('YYYY-MM-DD');
    } else if (_dateType === DateType.MONTH3) {
      const last3Month = today.subtract(3, 'month');
      _startDate = last3Month.format('YYYY-MM-DD');
    }

    setDateStart(_startDate);
    setDateEnd(_endDate);
    onSearch(_startDate, _endDate, marketSearch);
  };

  const handleSearch = () => {
    onSearch(dateStart, dateEnd, marketSearch);
  };

  return (
    <div className="flex max-sm:flex-col sm:items-center mb-1 [&>.split]:h-4 [&>.split]:border-l [&>.split]:border-slate-700">
      <div className="flex max-sm:px-1">
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
      </div>
      <div className="split max-sm:hidden"></div>
      <div className="flex">
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
    </div>
  );
}

interface IDate {
  date: string;
  setDate: (date: string) => void;
}
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
const Date = ({ date, setDate }: IDate) => {
  const [year, setYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');

  // 외부에서 날짜가 변경되면 로컬 state 업데이트
  useEffect(() => {
    if (!dayjs(date).isValid()) {
      return;
    }

    const [y, m, d] = date.split('-');
    setYear(y);
    setMonth(m);
    setDay(d);
  }, [date]);

  // 입력 중에는 숫자만 허용하고 자유롭게 입력
  const handleYearChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setYear(value);
    }
  };

  const handleMonthChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setMonth(value);
    }
  };

  const handleDayChange = (value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setDay(value);
    }
  };

  // blur 시점에 검증 및 보정
  const handleBlur = () => {
    if (!year || !month || !day) {
      return;
    }

    let y = Number(year);
    let m = Number(month);
    let d = Number(day);

    // 범위 보정
    y = Math.max(1900, Math.min(2100, y));
    m = Math.max(1, Math.min(12, m));

    // 월별 최대 일수 확인 및 보정
    const maxDay = DateUtils.getDaysInMonth(y, m);
    d = Math.max(1, Math.min(maxDay, d));

    // 최종 검증
    if (DateUtils.isValidDate(y, m, d)) {
      const formattedDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      // 로컬 state 업데이트 (포맷팅된 값으로)
      setYear(String(y));
      setMonth(String(m).padStart(2, '0'));
      setDay(String(d).padStart(2, '0'));
      
      // 부모 컴포넌트에 전달
      setDate(formattedDate);
    }
  };

  // Enter 키 입력 시에도 검증
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <S.FilterDateInputBox>
      <input
        type="text"
        className="w-[28px]"
        value={year}
        onChange={(e) => handleYearChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="YYYY"
        maxLength={4}
      />
      <span>-</span>
      <input
        type="text"
        className="w-4"
        value={month}
        onChange={(e) => handleMonthChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="MM"
        maxLength={2}
      />
      <span>-</span>
      <input
        type="text"
        className="w-4"
        value={day}
        onChange={(e) => handleDayChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="DD"
        maxLength={2}
      />
    </S.FilterDateInputBox>
  );
};
