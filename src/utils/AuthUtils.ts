import CommonUtils from './CommonUtils';

namespace AuthUtils {
  export function parseJwt(token: string): Record<string, any> {
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
  export function getTokenExpires(token: string): Date | null {
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
  export function isExpiredToken(token: string): boolean {
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
  export function authKakao(): void {
    const baseUrl = CommonUtils.getBaseUrl();
    const kakaoRedirectUrl = `${baseUrl}/oauth/kakao/callback`;
    window.Kakao.Auth.authorize({
      redirectUri: kakaoRedirectUrl,
      prompt: 'select_account',
    });
  }
}

export default AuthUtils;
