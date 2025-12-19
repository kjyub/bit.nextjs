import { disassemble } from 'es-hangul';
import Inko from 'inko';

/**
 * 문자열 처리 관련 유틸리티
 */
namespace StringUtils {
  /**
   * snake_case 또는 kebab-case 문자열을 camelCase로 변환합니다.
   * @param str - 변환할 문자열
   * @returns camelCase로 변환된 문자열
   * @example
   * toCamelCase('hello_world') // 'helloWorld'
   * toCamelCase('hello-world') // 'helloWorld'
   */
  export function toCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );
  }

  /**
   * 한글 입력을 영문 자판 기준으로 변환합니다.
   * @param value - 변환할 한글 문자열
   * @returns 영문으로 변환된 문자열
   * @example
   * koreanToEnglish('안녕') // 'dkssud'
   */
  export function koreanToEnglish(value: string): string {
    const inko = new Inko();
    return inko.ko2en(value);
  }

  /**
   * 한글 초성 검색을 지원하는 검색 함수입니다.
   * @param text - 검색 대상 텍스트
   * @param search - 검색어 (초성 포함 가능)
   * @returns 검색어가 텍스트에 포함되어 있는지 여부
   * @example
   * searchKorean('안녕하세요', 'ㅎㅅ') // true
   */
  export function searchKorean(text: string, search: string): boolean {
    const textArray = disassemble(text);
    const searchArray = disassemble(search);

    return textArray.includes(searchArray);
  }
}

export default StringUtils;

