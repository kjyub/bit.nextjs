import type { Token } from '@/types/users/UserTypes';
import ky, { type KyInstance, type Options } from 'ky';
import { setAuthorization, validateAuthToken, validateAuthTokenServer } from './kyHooks';

const URL = process.env.NEXT_PUBLIC_DJANGO_SERVER;

// 전역 토큰 저장소 (메모리)
let globalAuthToken: Token | null = null;

const kyApi = (options: Options = {}): KyInstance => {
  return ky.create({
    prefixUrl: URL,
    ...options,
  });
};

const kyCredentialApi = (options: Options = {}) => {
  return kyApi({
    credentials: 'include',
    ...options,
  });
};

const kyAuthApi = (options: Options = {}) => {
  return kyCredentialApi({
    hooks: {
      beforeRequest: [setAuthorization],
      afterResponse: [validateAuthToken],
    },
    ...options,
  });
};

export const authServerInstance = (options: Options = {}) => {
  return kyApi({
    ...options,
    hooks: {
      afterResponse: [validateAuthTokenServer],
    },
  });
};

export const credentialInstance = kyCredentialApi();
export const defaultInstance = kyApi();
export const authInstance = kyAuthApi();
export const fileNoneAuthInstance = kyApi();
export const fileInstance = kyAuthApi();
export const downloadInstance = kyApi({ headers: { 'Content-Type': 'application/octet-stream' } });

export const getAuthToken = (): Token | null => {
  return globalAuthToken;
};

export const setAuthToken = (token: Token | null) => {
  if (!token) return;

  globalAuthToken = token;
};

export const removeAuthToken = () => {
  globalAuthToken = null;
};
