import UserApi from '@/apis/api/users/UserApi';
import { CookieConsts } from '@/types/ApiTypes';
import { LoginResponse } from '@/types/users/UserTypes';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code') as string;

    const result = await UserApi.kakaoAuth(code);

    const cookie = await cookies();

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
    const blank: LoginResponse = {
      user: {},
      token: {
        access: '',
        refresh: '',
      },
    };

    return NextResponse.json(blank);
  }
}
