import UpbitApi from '@/apis/api/cryptos/UpbitApi';
import type { CandleMinuteUnits } from '@/types/cryptos/CryptoTypes';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ unit: CandleMinuteUnits }> }) {
  const searchParams = request.nextUrl.searchParams;
  const { unit } = await params;
  const marketCode = searchParams.get('market') as string;
  const count = Number(searchParams.get('count') as string);
  const to = searchParams.get('to') as string;

  const result = await UpbitApi.getCandleMinutes(marketCode, count, unit as CandleMinuteUnits, to);
  return NextResponse.json(result);
}
