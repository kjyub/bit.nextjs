/**
 * 숫자/수학 관련 유틸리티
 */
namespace NumberUtils {
  /**
   * 숫자를 지정된 유효숫자로 반올림합니다.
   * @param value - 반올림할 숫자
   * @param precision - 유효숫자 자릿수 (기본값: 0)
   * @returns 반올림된 숫자
   * @example
   * round(123.456, 2) // 120
   * round(123.456, 3) // 123
   */
  export function round(value: number, precision = 0): number {
    if (precision <= 0) {
      return Math.round(value);
    }
    return Number(value.toPrecision(precision));
  }

  /**
   * 배열에서 랜덤한 요소를 선택합니다.
   * @param list - 선택할 요소가 담긴 배열
   * @returns 랜덤하게 선택된 요소
   * @example
   * getRandomChoice([1, 2, 3]) // 1, 2, 또는 3 중 하나
   */
  export function getRandomChoice<T>(list: Array<T>): T {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  /**
   * 주어진 범위 내의 랜덤 정수를 반환합니다.
   * @param min - 최소값 (포함)
   * @param max - 최대값 (포함)
   * @returns 랜덤 정수
   * @example
   * getRandomInt(1, 10) // 1~10 사이의 정수
   */
  export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 숫자가 주어진 범위 내에 있는지 확인합니다.
   * @param value - 확인할 숫자
   * @param min - 최소값
   * @param max - 최대값
   * @returns 범위 내에 있으면 true
   */
  export function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  /**
   * 숫자를 주어진 범위 내로 제한합니다.
   * @param value - 제한할 숫자
   * @param min - 최소값
   * @param max - 최대값
   * @returns 범위 내로 제한된 숫자
   */
  export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * 숫자를 지정된 소수점 자릿수로 반올림합니다.
   * @param value - 반올림할 숫자
   * @param decimalPlaces - 소수점 자릿수 (기본값: 0)
   * @returns 반올림된 숫자
   * @example
   * roundDecimal(123.456, 2) // 123.46
   * roundDecimal(123.456, 1) // 123.5
   */
  export function roundDecimal(value: number, decimalPlaces = 0): number {
    const multiplier = 10 ** decimalPlaces;
    return Math.round(value * multiplier) / multiplier;
  }
}

export default NumberUtils;
