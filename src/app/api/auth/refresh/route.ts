import UserApi from '@/apis/api/users/UserApi';
import { CookieConsts } from '@/types/ApiTypes';
import { LoginResponse } from '@/types/users/UserTypes';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookie = await cookies();

  try {
    const refreshToken = cookie.get(CookieConsts.USER_REFRESH_TOKEN)?.value;

    const result = await UserApi.refreshToken(refreshToken);

    if (result.token.access) {
      const { access, refresh } = result.token;

      cookie.set(CookieConsts.USER_ACCESS_TOKEN, access || '', {
        httpOnly: true,
        sameSite: 'lax',
      });
      cookie.set(CookieConsts.USER_REFRESH_TOKEN, refresh || '', {
        httpOnly: true,
        sameSite: 'lax',
      });

      return NextResponse.json(result);
    }

    throw Error('');
  } catch {
    // 리프레시 만료 혹은 에러인 경우 로그아웃 처리
    cookie.delete(CookieConsts.USER_ACCESS_TOKEN);
    cookie.delete(CookieConsts.USER_REFRESH_TOKEN);

    const data: LoginResponse = {
      user: {},
      token: { access: '', refresh: '' },
    };

    return NextResponse.json(data);
  }
}
