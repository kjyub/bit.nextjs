import UpbitApi from '@/apis/api/cryptos/UpbitApi';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const marketCodes = body.markets as string[];

  const result = await UpbitApi.getMarketsCurrent(marketCodes);
  return NextResponse.json(result);
}
