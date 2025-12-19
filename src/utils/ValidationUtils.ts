/**
 * 유효성 검사 관련 유틸리티
 */
namespace ValidationUtils {
  /**
   * 비밀번호 유효성을 검사합니다.
   * 조건: 최소 6자리, 영문자와 숫자 모두 포함
   * @param value - 검사할 비밀번호
   * @returns 유효하면 true
   * @example
   * isValidPassword('abc123') // true
   * isValidPassword('123456') // false (숫자만)
   * isValidPassword('abcdef') // false (문자만)
   */
  export function isValidPassword(value: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(value);
  }

  /**
   * 이메일 유효성을 검사합니다.
   * @param value - 검사할 이메일
   * @returns 유효하면 true
   */
  export function isValidEmail(value: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  /**
   * 전화번호 유효성을 검사합니다.
   * @param value - 검사할 전화번호
   * @returns 유효하면 true
   */
  export function isValidPhoneNumber(value: string): boolean {
    const cleanValue = value.replace(/[^0-9]/g, '');
    // 휴대폰: 010, 011, 016, 017, 018, 019
    // 지역번호: 02, 031-064 등
    const regex = /^(01[016789]\d{7,8}|0[2-6][1-5]?\d{6,8})$/;
    return regex.test(cleanValue);
  }

  /**
   * 빈 값인지 확인합니다.
   * @param value - 확인할 값
   * @returns 빈 값이면 true
   */
  export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
   * 숫자 문자열인지 확인합니다.
   * @param value - 확인할 값
   * @returns 숫자 문자열이면 true
   */
  export function isNumericString(value: string): boolean {
    return /^\d+$/.test(value);
  }
}

export default ValidationUtils;

