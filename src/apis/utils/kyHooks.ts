import { AccountStatusTypes, type LoginResponse } from '@/types/users/UserTypes';
import ky, { type KyRequest, type KyResponse, type NormalizedOptions } from 'ky';
import { getAuthToken, removeAuthToken, setAuthToken } from './instances';
import AuthUtils from '@/utils/AuthUtils';

export const setAuthorization = (request: KyRequest) => {
  const token = getAuthToken();

  // 전역 토큰이 있으면 헤더에 추가
  if (token) {
    request.headers.set('Authorization', `Bearer ${token.access}`);
  } else {
    // 토큰이 없는 경우 진행하지 않고 에러 처리
    return;
  }
};

export const validateAuthToken = async (request: KyRequest, _options: NormalizedOptions, response: KyResponse) => {
  const token = getAuthToken();
  // 토큰이 없어서 401 뜬 경우 정상 처리
  if (response?.status === 401 && token === null) {
    return response;
  }

  // 재요청 실패 체크
  if (response?.status === 401 && request.headers.get('x-retry') === 'true') {
    throw new Error('토큰이 없습니다.');
  }

  // 401 에러시 토큰 재발급 시도
  if (response?.status === 401 && request.headers.get('x-retry') !== 'true') {
    try {
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/refresh/`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ refresh: token?.refresh }),
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

      throw new Error('토큰 갱신 실패');
    }
  }

  return response;
};

export const validateAuthTokenServer = async (request: KyRequest, options: NormalizedOptions, response: KyResponse) => {
  // 재요청 실패 체크
  if (response?.status === 401 && request.headers.get('x-retry') === 'true') {
    throw new Error('토큰 만료');
  }

  // 401 에러시 토큰 재발급 시도
  if (response?.status === 401 && request.headers.get('x-retry') !== 'true') {
    const refreshToken = request.headers.get('Refresh');

    try {
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/refresh/`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!refreshResponse.ok) {
        throw new Error('토큰 갱신 실패');
      }

      const result = (await refreshResponse.json()) as LoginResponse;

      if (!result.token.access) {
        throw new Error('토큰 만료');
      }

      // 원본 요청 재시도
      request.headers.set('Authorization', `Bearer ${result.token.access}`);
      request.headers.set('Refresh', result.token.refresh ?? '');
      request.headers.set('x-retry', 'true');

      return ky(request);
    } catch (refreshError) {
      try {
        if (refreshToken === null) {
          return response;
        }

        const tokenData = AuthUtils.parseJwt(refreshToken);
        if (tokenData.account_status === AccountStatusTypes.TEMP) {
          return response;
        }
      } catch {
        //
      }

      request.headers.delete('Authorization');
      await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/signout/`);

      throw new Error('토큰 만료');
    }
  }

  return response;
};
