import { CookieConsts } from '@/types/ApiTypes';
import type { Token } from '@/types/users/UserTypes';
import type { Options } from 'ky';
import { cookies } from 'next/headers';

namespace AuthServerUtils {
  export async function getAuthToken(): Promise<Token | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(CookieConsts.USER_ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(CookieConsts.USER_REFRESH_TOKEN)?.value;
    if (!accessToken || !refreshToken) {
      return null;
    }

    return { access: accessToken, refresh: refreshToken };
  }
  export async function getAuthInstanceOptions(): Promise<Options> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(CookieConsts.USER_ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(CookieConsts.USER_REFRESH_TOKEN)?.value;
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Refresh: refreshToken,
      },
    };
  }
}

export default AuthServerUtils;
