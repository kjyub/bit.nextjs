import type { LoginResponse } from '@/types/users/UserTypes';
import ky, { type KyRequest, type KyResponse, type NormalizedOptions } from 'ky';
import { getAuthToken, removeAuthToken, setAuthToken } from './instances';

export const setAuthorization = (request: KyRequest) => {
  const token = getAuthToken();

  // 전역 토큰이 있으면 헤더에 추가
  if (token) {
    request.headers.set('Authorization', `Bearer ${token.access}`);
  } else {
    // 토큰이 없는 경우 진행하지 않고 에러 처리
    throw new Error('토큰이 없습니다.');
  }
};

export const validateAuthToken = async (request: KyRequest, _options: NormalizedOptions, response: KyResponse) => {
  // 재요청 실패 체크
  if (response?.status === 401 && request.headers.get('x-retry') === 'true') {
    throw error;
  }

  // 401 에러시 토큰 재발급 시도
  if (response?.status === 401 && request.headers.get('x-retry') !== 'true') {
    try {
      const token = getAuthToken();
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/refresh/`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ refresh: token.refresh }),
      });
      if (!refreshResponse.ok) {
        throw new Error('토큰 갱신 실패');
      }

      const result = (await refreshResponse.json()) as LoginResponse;

      if (!result.token.access) {
        throw new Error('토큰 만료');
      }

      // 새 토큰 저장
      setAuthToken(result.token);

      // 원본 요청 재시도
      request.headers.set('Authorization', `Bearer ${result.token.access}`);
      request.headers.set('x-retry', 'true');

      return ky(request);
    } catch {
      request.headers.set('x-retry', 'true');
      request.headers.delete('Authorization');
      removeAuthToken();

      // 새로고침
      if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/signout/`);
        window.location.reload();
      }

      throw error;
    }
  }

  return response;
};
