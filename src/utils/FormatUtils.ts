import { TextFormats } from '@/types/CommonTypes';

/**
 * 텍스트/숫자 포맷팅 관련 유틸리티
 */
namespace FormatUtils {
  /**
   * 전화번호를 포맷팅합니다.
   * @param value - 포맷팅할 전화번호 문자열
   * @returns 포맷팅된 전화번호 (예: 010-1234-5678)
   * @example
   * telFormat('01012345678') // '010-1234-5678'
   * telFormat('0212345678')  // '02-1234-5678'
   */
  export function telFormat(value: string): string {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const result: string[] = [];
    let restNumber = '';

    // 지역번호와 나머지 번호로 나누기
    if (cleanValue.startsWith('02')) {
      // 서울 02 지역번호
      result.push(cleanValue.substring(0, 2));
      restNumber = cleanValue.substring(2);
    } else if (cleanValue.startsWith('1')) {
      // 지역 번호가 없는 경우 (1xxx-yyyy)
      restNumber = cleanValue;
    } else {
      // 나머지 3자리 지역번호 (0xx-yyyy-zzzz)
      result.push(cleanValue.substring(0, 3));
      restNumber = cleanValue.substring(3);
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

  /**
   * 입력 이벤트에서 전화번호를 자동 포맷팅합니다.
   * @param e - 입력 이벤트
   */
  export function telFormatter(e: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = e.target;
    if (!value) {
      e.target.value = value;
      return;
    }
    e.target.value = telFormat(value);
  }

  /**
   * 숫자를 천 단위 구분 기호로 포맷팅합니다.
   * @param value - 포맷팅할 숫자
   * @returns 천 단위로 구분된 문자열
   */
  function formatNumber(value: string | number): string {
    const text = String(value);
    const number = Number(value);

    if (number === 0) return '0';

    if (
      !Number.isNaN(number) &&
      text[text.length - 1] !== '.' &&
      text !== '' &&
      !(text.includes('.') && text[text.length - 1] === '0')
    ) {
      return number.toLocaleString(undefined, { maximumFractionDigits: 8 });
    }

    return text;
  }

  /**
   * 숫자를 한글 단위(만, 억, 조, 경)로 변환합니다.
   * @param value - 변환할 숫자
   * @param simple - true면 가장 큰 단위만 표시
   * @returns 한글 단위로 변환된 문자열
   */
  function formatKoreanPrice(value: number, simple = false): string {
    if (Number.isNaN(value) || value < 0) {
      return String(value);
    }

    const unitWords = ['', '만', '억', '조', '경'];
    const splitUnit = 10000;
    const resultArray: number[] = [];

    for (let i = 0; i < unitWords.length; i++) {
      const unitResult = Math.floor((value % splitUnit ** (i + 1)) / splitUnit ** i);
      if (unitResult > 0) {
        resultArray[i] = unitResult;
      }
    }

    if (simple) {
      const lastIndex = resultArray.length - 1;
      return `${formatNumber(resultArray[lastIndex])}${unitWords[lastIndex]}`;
    }

    let resultString = '';
    for (let i = 0; i < resultArray.length; i++) {
      if (!resultArray[i]) continue;
      resultString = `${formatNumber(resultArray[i])}${unitWords[i]}${resultString}`;
    }

    return resultString;
  }

  /**
   * 텍스트를 지정된 포맷으로 변환합니다.
   * @param text - 변환할 텍스트
   * @param format - 적용할 포맷 타입
   * @returns 포맷팅된 문자열
   */
  export function textFormat(text: string | number, format: TextFormats): string {
    const stringText = !text ? '' : String(text);

    switch (format) {
      case TextFormats.NUMBER:
        return formatNumber(text);
      case TextFormats.PRICE:
        return `${formatNumber(text)}원`;
      case TextFormats.KOREAN_PRICE:
        return formatKoreanPrice(Number(text), false) || '';
      case TextFormats.KOREAN_PRICE_SIMPLE:
        return formatKoreanPrice(Number(text), true) || '';
      default:
        return stringText || '';
    }
  }

  /**
   * 입력 텍스트에서 포맷 문자를 제거합니다.
   * @param text - 처리할 텍스트
   * @param format - 적용된 포맷 타입
   * @returns 포맷이 제거된 문자열
   */
  export function textFormatInput(text: string, format: TextFormats): string {
    switch (format) {
      case TextFormats.NUMBER:
        return text.replaceAll(',', '');
      case TextFormats.NUMBER_ONLY:
        return text.replace(/[^0-9]/g, '');
      case TextFormats.PRICE:
        return text.replaceAll(',', '').replaceAll('원', '');
      case TextFormats.TEL:
        return telFormat(text);
      default:
        return text;
    }
  }

  /**
   * 역순 인덱스를 계산합니다. (페이지네이션에서 번호 표시용)
   * @param index - 현재 페이지 내 인덱스 (0부터 시작)
   * @param pageIndex - 현재 페이지 번호 (1부터 시작)
   * @param pageSize - 페이지당 아이템 수
   * @param itemCount - 전체 아이템 수
   * @returns 역순 인덱스 번호
   */
  export function rowIndex(
    index: number,
    pageIndex: number,
    pageSize: number,
    itemCount: number,
  ): number {
    return itemCount - ((pageIndex - 1) * pageSize + index);
  }

  /**
   * 숫자를 퍼센트 문자열로 변환합니다.
   * @param value - 변환할 숫자 (0~1 사이의 값, 예: 0.5는 50%)
   * @param decimalPlaces - 소수점 자릿수 (기본값: 0)
   * @returns 퍼센트 문자열
   * @example
   * percent(0.5, 0) // '50%'
   * percent(0.123, 2) // '12.3%'
   */
  export function percent(value: number, decimalPlaces = 0): string {
    const multiplier = 10 ** decimalPlaces;
    return `${Math.round(value * 100 * multiplier) / multiplier}%`;
  }
}

export default FormatUtils;

