import type { CryptoLayoutMode } from '@/store/providers/CryptoProvider';

/**
 * 경로별 레이아웃 모드 설정
 * 우선순위는 상세한 경로가 위쪽에 위치해야 합니다.
 */
export const CRYPTO_LAYOUT_CONFIG: { pattern: RegExp; mode: CryptoLayoutMode }[] = [
  {
    // /crypto/[code]/community
    pattern: /^\/crypto\/[^/]+\/community$/,
    mode: 'compact',
  },
  {
    // /crypto/[code]
    pattern: /^\/crypto\/[^/]+$/,
    mode: 'wide',
  },
  {
    // /crypto
    pattern: /^\/crypto$/,
    mode: 'compact',
  },
];

/**
 * 현재 경로에 맞는 레이아웃 모드를 반환합니다.
 */
export function getLayoutModeByPathname(pathname: string): CryptoLayoutMode {
  const config = CRYPTO_LAYOUT_CONFIG.find((item) => item.pattern.test(pathname));
  return config?.mode || 'compact';
}

