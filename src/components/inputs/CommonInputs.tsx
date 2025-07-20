import { useEffect, useRef, useState } from 'react';

const localeStringOption: Intl.NumberFormatOptions = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 8,
};

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}
export function NumberInput({ value, setValue, min, max, ...props }: NumberInputProps) {
  const [internalValue, setInternalValue] = useState<string>(String(value));
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorUpdateRef = useRef<() => void>(() => {}); // 커서 위치 업데이트 함수

  useEffect(() => {
    if (value) {
      setInternalValue(value.toLocaleString(undefined, localeStringOption));
    }
  }, [value]);

  useEffect(() => {
    cursorUpdateRef.current();
  }, [internalValue]);

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '');
    let value = Number(raw);

    if (Number.isNaN(value) || raw === '') {
      setValue(0);
      setInternalValue('');
      return;
    }

    if (min !== undefined && value < min) value = min;
    if (max !== undefined && value > max) value = max;

    setValue(value);
    const formatted = value.toLocaleString(undefined, localeStringOption);
    setInternalValue(formatted);

    // 커서 업데이트
    const inputCursor = e.target.selectionStart ?? raw.length;
    const onlyNumberCursor = e.target.value.slice(0, inputCursor).replace(/[^\d]/g, '').length; // 콤마를 제외한 현재 커서 위치

    cursorUpdateRef.current = () => {
      if (!inputRef.current) return;

      let numberCount = 0;
      let newCursor = 0;

      // 콤마를 제외한 현재 커서 위치까지 진행
      while (numberCount < onlyNumberCursor && newCursor < formatted.length) {
        if (/\d/.test(formatted[newCursor])) {
          numberCount++; // 숫자일 때 추가
        }
        newCursor++; // 숫자와 콤마일 때 추가
      }

      inputRef.current.setSelectionRange(newCursor, newCursor);
    };

    // internalValue가 업데이트 되지 않아 렌더링 되지 않는 경우 직접 실행
    if (internalValue === formatted) {
      setTimeout(() => {
        cursorUpdateRef.current();
      }, 0);
    }
  };

  return <input ref={inputRef} value={internalValue} onChange={handleValue} min={min} max={max} {...props} />;
}
