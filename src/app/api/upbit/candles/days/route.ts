import UpbitApi from '@/apis/api/cryptos/UpbitApi';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const marketCode = searchParams.get('market') as string;
  const count = Number(searchParams.get('count') as string);
  const to = searchParams.get('to') as string;

  const result = await UpbitApi.getCandleDays(marketCode, count, to);
  return NextResponse.json(result);
}
