import { CookieConsts } from '@/types/ApiTypes';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookie = await cookies();

  cookie.delete(CookieConsts.USER_ACCESS_TOKEN);
  cookie.delete(CookieConsts.USER_REFRESH_TOKEN);

  return NextResponse.json({ message: 'success' });
}
