/**
 * @deprecated 이 파일은 더 이상 사용되지 않습니다.
 * 각 카테고리별 유틸리티를 직접 import하세요:
 *
 * - StringUtils: 문자열 처리 (toCamelCase, koreanToEnglish, searchKorean)
 * - NumberUtils: 숫자/수학 (round, getRandomChoice)
 * - FormatUtils: 포맷팅 (telFormat, textFormat, textFormatInput, rowIndex)
 * - DateUtils: 날짜 (setMaxDays, getDateShorten)
 * - ValidationUtils: 유효성 검사 (isValidPassword)
 * - DomUtils: DOM 조작 (copyClipboard, setTextareaAutoHeight)
 * - BrowserUtils: 브라우저/URL (getBaseUrl, getCurrentBaseUrl, isPathActive)
 */

// 개별 유틸리티 export
export { default as BrowserUtils } from './BrowserUtils';
export { default as DateUtils } from './DateUtils';
export { default as DomUtils } from './DomUtils';
export { default as FormatUtils } from './FormatUtils';
export { default as NumberUtils } from './NumberUtils';
export { default as StringUtils } from './StringUtils';
export { default as ValidationUtils } from './ValidationUtils';
export { TextFormats } from '@/types/CommonTypes';
