import UserApi from '@/apis/api/users/UserApi';
import { SessionStorageConsts } from '@/types/ApiTypes';
import User from '@/types/users/User';
import { Session } from 'next-auth';
import { UpdateSession } from 'next-auth/react';
import CommonUtils from './CommonUtils';

export default class AuthUtils {
  static parseJwt(token: string): object {
    if (CommonUtils.isStringNullOrEmpty(token)) {
      return {};
    }

    const base64Url = token.split('.')[1];
    if (CommonUtils.isStringNullOrEmpty(base64Url)) {
      return {};
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }
  static getTokenExpires(token: string): Date | null {
    if (CommonUtils.isStringNullOrEmpty(token)) {
      return null;
    }

    const decodedToken = this.parseJwt(token);

    if (decodedToken.exp) {
      return new Date(decodedToken.exp * 1000); // 초 단위를 밀리초로 변환
    } else {
      return null;
    }
  }
  static isExpiredToken(token: string): boolean {
    if (CommonUtils.isStringNullOrEmpty(token)) {
      return true;
    }

    const expireDate = this.getTokenExpires(token);
    if (expireDate === null) {
      return false;
    }

    const now = new Date();

    return expireDate.getTime() <= now.getTime();
  }
  static isSessionAuth(session: Session) {
    if (CommonUtils.isNullOrUndefined(session) || CommonUtils.isNullOrUndefined(session.user)) {
      return false;
    }

    return true;
  }
  static authKakao(): string {
    const baseUrl = CommonUtils.getBaseUrl();
    const kakaoRedirectUrl = `${baseUrl}/oauth/kakao/callback`;
    window.Kakao.Auth.authorize({
      redirectUri: kakaoRedirectUrl,
      prompt: 'select_account',
    });
  }
  static async getCurrentUser(session: Session | null = null, update: UpdateSession | null = null): User {
    const newUser = new User();

    const userData = await UserApi.getUserDataSelf();

    if (userData === {} || CommonUtils.isStringNullOrEmpty(userData.uuid)) {
      return newUser;
    }

    if (session && update) {
      await update({
        ...session,
        user: userData,
      });

      sessionStorage.setItem(SessionStorageConsts.USER_DATA, userData);
    }

    newUser.parseResponse(userData);

    return newUser;
  }
}
