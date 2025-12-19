import dayjs from 'dayjs';

/**
 * 날짜/시간 관련 유틸리티
 */
namespace DateUtils {
  /**
   * 윤년인지 확인합니다.
   * @param year - 확인할 년도
   * @returns 윤년이면 true
   */
  export function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * 특정 월의 최대 일수를 반환합니다.
   * @param year - 년도
   * @param month - 월 (1-12)
   * @returns 해당 월의 최대 일수
   */
  export function getDaysInMonth(year: number, month: number): number {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 2 && isLeapYear(year)) {
      return 29;
    }

    return daysInMonth[month - 1];
  }

  /**
   * 주어진 일자가 해당 월의 최대 일수를 초과하면 최대 일수로 제한합니다.
   * @param year - 년도
   * @param month - 월 (1-12)
   * @param day - 일
   * @returns 유효한 일자 (최대 일수 이하)
   * @example
   * setMaxDays(2024, 2, 30) // 29 (윤년)
   * setMaxDays(2023, 2, 30) // 28 (평년)
   */
  export function setMaxDays(year: number, month: number, day: number): number {
    const maxDay = getDaysInMonth(year, month);
    return day > maxDay ? maxDay : day;
  }

  /**
   * 날짜를 상대적인 시간 표현으로 변환합니다.
   * @param date - 변환할 날짜 문자열
   * @returns 상대적 시간 문자열 (예: '5분 전', '2일 전')
   * @example
   * getDateShorten('2024-01-01T12:00:00') // '3일 전' (현재 시간 기준)
   */
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
      }
      if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
      }
      if (diffHours < 24) {
        return `${diffHours}시간 전`;
      }
      if (diffDays < 7) {
        return `${diffDays}일 전`;
      }

      return inputDate.format('YYYY-MM-DD');
    } catch {
      return '';
    }
  }

  /**
   * 날짜를 지정된 포맷으로 변환합니다.
   * @param date - 변환할 날짜
   * @param format - dayjs 포맷 문자열
   * @returns 포맷된 날짜 문자열
   */
  export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
    return dayjs(date).format(format);
  }

  /**
   * 날짜/시간을 포맷팅합니다.
   * @param date - 변환할 날짜
   * @returns 포맷된 날짜/시간 문자열
   */
  export function formatDateTime(date: string | Date): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }
}

export default DateUtils;

