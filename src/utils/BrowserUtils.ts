/**
 * 브라우저/URL 관련 유틸리티
 */
namespace BrowserUtils {
  /**
   * 외부 브라우저로 리다이렉트합니다. (인앱 브라우저에서 탈출용)
   */
  export function redirectToExternalBrowser(): void {
    const targetUrl = window.location.href;

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = 'x-web-search://?';
    } else {
      window.location.href = `intent://${targetUrl.replace(
        /https?:\/\//i,
        '',
      )}#Intentscheme=httppackage=com.android.chromeend`;
    }
  }

  /**
   * 외부 브라우저로 이동이 필요한지 확인하고 처리합니다.
   * @returns 리다이렉트가 발생했으면 true
   */
  export function goExternalBrowser(): boolean {
    return false;
  }

  /**
   * 클라이언트(브라우저) 환경인지 확인합니다.
   * @returns 브라우저 환경이면 true
   */
  export function isClient(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  /**
   * 현재 페이지의 기본 URL을 반환합니다.
   * @returns 프로토콜, 호스트네임, 포트를 포함한 기본 URL
   * @example
   * getBaseUrl() // 'https://example.com:3000'
   */
  export function getBaseUrl(): string {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }

  /**
   * 현재 페이지의 기본 URL을 반환합니다. (href에서 추출)
   * @returns 기본 URL
   */
  export function getCurrentBaseUrl(): string {
    return window.location.href.split('/').slice(0, 3).join('/');
  }

  /**
   * 현재 pathname이 주어진 경로와 일치하는지 확인합니다.
   * 첫 번째 경로 세그먼트만 비교합니다.
   * @param pathname - 현재 pathname
   * @param path - 비교할 경로
   * @returns 경로가 일치하면 true
   * @example
   * isPathActive('/crypto/BTC-KRW', '/crypto') // true
   * isPathActive('/mypage', '/crypto') // false
   */
  export function isPathActive(pathname: string, path: string): boolean {
    try {
      return pathname.split('/')[1] === path.split('/')[1];
    } catch {
      return false;
    }
  }

  /**
   * URL 쿼리 파라미터를 객체로 파싱합니다.
   * @param search - URL search 문자열 (예: '?foo=bar&baz=qux')
   * @returns 파라미터 객체
   */
  export function parseQueryParams(search: string): Record<string, string> {
    const params = new URLSearchParams(search);
    const result: Record<string, string> = {};

    params.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  /**
   * 객체를 URL 쿼리 문자열로 변환합니다.
   * @param params - 변환할 파라미터 객체
   * @returns 쿼리 문자열 (예: 'foo=bar&baz=qux')
   */
  export function buildQueryString(params: Record<string, string | number | boolean>): string {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
  }
}

export default BrowserUtils;
