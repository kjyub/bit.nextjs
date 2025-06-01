import ky, { type KyInstance, type Options } from 'ky';
import { setAuthorization, validateAuthToken } from './kyHooks';
import { Token } from '@/types/users/UserTypes';

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

export const credentialInstance = kyCredentialApi();
export const defaultInstance = kyApi();
export const authInstance = kyAuthApi();
export const fileNoneAuthInstance = kyApi({ headers: { 'Content-Type': 'multipart/form-data' } });
export const fileInstance = kyAuthApi({ headers: { 'Content-Type': 'multipart/form-data' } });
export const downloadInstance = kyApi({ responseType: 'blob' });

export const getAuthToken = (): Token | null => {
  return globalAuthToken;
};

export const setAuthToken = (token: Token) => {
  globalAuthToken = token;
};

export const removeAuthToken = () => {
  globalAuthToken = null;
};
