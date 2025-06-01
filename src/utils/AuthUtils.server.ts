import { CookieConsts } from '@/types/ApiTypes';
import { cookies } from 'next/headers';

export default class AuthServerUtils {
  static async getAuthToken() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(CookieConsts.USER_ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(CookieConsts.USER_REFRESH_TOKEN)?.value;
    return { access: accessToken, refresh: refreshToken };
  }
}
