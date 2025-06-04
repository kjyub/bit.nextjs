import CommonUtils from './CommonUtils';

export default class AuthUtils {
  static parseJwt(token: string): object {
    if (!token) {
      return {};
    }

    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return {};
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }
  static getTokenExpires(token: string): Date | null {
    if (!token) {
      return null;
    }

    const decodedToken = AuthUtils.parseJwt(token);

    if (decodedToken.exp) {
      return new Date(decodedToken.exp * 1000); // 초 단위를 밀리초로 변환
    } else {
      return null;
    }
  }
  static isExpiredToken(token: string): boolean {
    if (!token) {
      return true;
    }

    const expireDate = AuthUtils.getTokenExpires(token);
    if (!expireDate) {
      return false;
    }

    const now = new Date();

    return expireDate.getTime() <= now.getTime();
  }
  static authKakao(): string {
    const baseUrl = CommonUtils.getBaseUrl();
    const kakaoRedirectUrl = `${baseUrl}/oauth/kakao/callback`;
    window.Kakao.Auth.authorize({
      redirectUri: kakaoRedirectUrl,
      prompt: 'select_account',
    });
  }
}
