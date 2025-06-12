import UpbitApi from '@/apis/api/cryptos/UpbitApi';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const marketCode = searchParams.get('market') as string;
  const level = Number(searchParams.get('level') as string);

  const result = await UpbitApi.getOrderBook(marketCode, level);
  return NextResponse.json(result);
}
