import { TextFormats } from '@/types/CommonTypes';
import dayjs from 'dayjs';
import { disassemble } from 'es-hangul';
import Inko from 'inko';

namespace CommonUtils {
  export function getBaseUrl(): string {
    const currentURL = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
    return currentURL;
  }
  export function toCamelCase(str: string) {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
  }
  export function round(value: number, round = 0): number {
    // return Math.round(value * Math.pow(10, round)) / Math.pow(10, round)
    return Number(value.toPrecision(round));
  }
  export function getRandomChoice<T>(list: Array<T>): T {
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  }
  export function getCurrentBaseUrl(): string {
    return window.location.href.split('/').slice(0, 3).join('/');
  }
  export async function copyClipboard(value: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return false;
    }
    return true;
  }
  export function telFormat(v: string): string {
    const value = v.replace(/[^0-9]/g, '');

    const result = [];
    let restNumber = '';

    // 지역번호와 나머지 번호로 나누기
    if (value.startsWith('02')) {
      // 서울 02 지역번호
      result.push(value.substr(0, 2));
      restNumber = value.substring(2);
    } else if (value.startsWith('1')) {
      // 지역 번호가 없는 경우
      // 1xxx-yyyy
      restNumber = value;
    } else {
      // 나머지 3자리 지역번호
      // 0xx-yyyy-zzzz
      result.push(value.substr(0, 3));
      restNumber = value.substring(3);
    }

    if (restNumber.length === 7) {
      // 7자리만 남았을 때는 xxx-yyyy
      result.push(restNumber.substring(0, 3));
      result.push(restNumber.substring(3));
    } else {
      result.push(restNumber.substring(0, 4));
      result.push(restNumber.substring(4));
    }

    return result.filter((val) => val).join('-');
  }
  export function telFormatter(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!value) {
      e.target.value = value;
    }

    e.target.value = CommonUtils.telFormat(value);
  }
  export function textFormat(text: string | number, format: TextFormats): string {
    let result = !text ? '' : String(text);

    if (format === TextFormats.NUMBER) {
      const number = Number(text);

      if (number === 0) {
        result = '0';
      } else if (
        !Number.isNaN(number) &&
        result[result.length - 1] !== '.' &&
        result !== '' &&
        !(result.includes('.') && result[result.length - 1] === '0')
      ) {
        result = number.toLocaleString(undefined, { maximumFractionDigits: 8 });
      }
    } else if (format === TextFormats.PRICE) {
      const number = CommonUtils.textFormat(text, TextFormats.NUMBER);
      result = `${number}원`;
    } else if (format === TextFormats.KOREAN_PRICE) {
      if (Number.isNaN(Number(text)) || Number(text) < 0) {
        return String(text);
      }

      const inputNumber = Number(text);
      const unitWords = ['', '만', '억', '조', '경'];
      const splitUnit = 10000;
      const splitCount = unitWords.length;
      const resultArray = [];
      let resultString = '';

      for (let i = 0; i < splitCount; i++) {
        let unitResult = (inputNumber % splitUnit ** (i + 1)) / splitUnit ** i;
        unitResult = Math.floor(unitResult);
        if (unitResult > 0) {
          resultArray[i] = unitResult;
        }
      }

      for (let i = 0; i < resultArray.length; i++) {
        if (!resultArray[i]) continue;
        resultString = String(CommonUtils.textFormat(resultArray[i], TextFormats.NUMBER)) + unitWords[i] + resultString;
      }

      result = resultString;
    } else if (format === TextFormats.KOREAN_PRICE_SIMPLE) {
      if (Number.isNaN(Number(text)) || Number(text) < 0) {
        return String(text);
      }

      const inputNumber = Number(text);
      const unitWords = ['', '만', '억', '조', '경'];
      const splitUnit = 10000;
      const splitCount = unitWords.length;
      const resultArray = [];
      let resultString = '';

      for (let i = 0; i < splitCount; i++) {
        let unitResult = (inputNumber % splitUnit ** (i + 1)) / splitUnit ** i;
        unitResult = Math.floor(unitResult);
        if (unitResult > 0) {
          resultArray[i] = unitResult;
        }
      }

      const lastIndex = resultArray.length - 1;
      resultString = String(CommonUtils.textFormat(resultArray[lastIndex], TextFormats.NUMBER)) + unitWords[lastIndex];

      result = resultString;
    }

    if (!result) {
      result = '';
    }

    return result;
  }
  export function textFormatInput(text: string, format: TextFormats): string {
    let result = text;

    if (format === TextFormats.NUMBER) {
      result = text.replaceAll(',', '');
    } else if (format === TextFormats.NUMBER_ONLY) {
      result = text.replace(/[^0-9]/g, '');
    } else if (format === TextFormats.PRICE) {
      // 미구현
      const number = CommonUtils.textFormatInput(text, TextFormats.NUMBER);
      result = number.replaceAll('원', '');
    } else if (format === TextFormats.TEL) {
      result = CommonUtils.telFormat(text);
    }

    return result;
  }
  export function setMaxDays(year: number, month: number, day: number) {
    // 각 월의 최대 날짜 수
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 윤년 계산
    const isLeapYear = (year: number) => {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

    // 2월에 대해 윤년을 고려하여 최대 날짜 수정
    if (isLeapYear(year)) {
      daysInMonth[1] = 29;
    }

    // 해당 월의 최대 날짜 수 가져오기
    const maxDay = daysInMonth[month - 1];

    // 날짜가 최대 날짜 수를 초과하면 최대 날짜로 설정
    if (day > maxDay) {
      return maxDay;
    }

    return day;
  }
  export function isValidPassword(value: string): boolean {
    // 정규식: 최소 6자리, 영문자와 숫자 포함
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(value);
  }
  export function setTextareaAutoHeight(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const element = e.target;

    if (!element) {
      return;
    }

    element.style.height = 'auto';
    element.style.height = `${Number(element.scrollHeight) + 4}px`;
  }
  export function koreanToEnglish(value: string): string {
    const inko = new Inko();
    // const convertedInput = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, (char) => romanize(char))
    return inko.ko2en(value);
  }
  export function rowIndex(index: number, pageIndex: number, pageSize: number, itemCount: number): number {
    return itemCount - ((pageIndex - 1) * pageSize + index);
  }
  export function getDateShorten(date: string): string {
    try {
      const now = dayjs();
      const inputDate = dayjs(date);
      const diffSeconds = now.diff(inputDate, 'seconds');
      const diffMinutes = now.diff(inputDate, 'minutes');
      const diffHours = now.diff(inputDate, 'hours');
      const diffDays = now.diff(inputDate, 'days');

      if (diffSeconds < 60) {
        return `${diffSeconds}초 전`;
      } else if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
      } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
      } else if (diffDays < 7) {
        return `${diffDays}일 전`;
      } else {
        return inputDate.format('YYYY-MM-DD');
      }
    } catch {
      return '';
    }
  }
  export function isPathActive(pathname: string, path: string): boolean {
    try {
      return pathname.split('/')[1] === path.split('/')[1];
    } catch {
      return false;
    }
  }
  export function searchKorean(text: string, search: string): boolean {
    const textArray = disassemble(text);
    const searchArray = disassemble(search);

    return textArray.includes(searchArray);
  }
}

export default CommonUtils;
