import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import { Suspense } from 'react';
import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';

async function MarketData() {
  try {
    // Promise.race를 사용하여 5초 타임아웃 구현
    const result = await Promise.race([
      TradeGoApi.getMarketCurrent('KRW-BTC'),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      )
    ]) as IUpbitMarketTicker;

    return (
      <div>
        <p>{result.code}</p>
        <span>{result.trade_price}</span>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500">
        {error instanceof Error && error.message === 'Request timeout' 
          ? '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.'
          : '데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.'}
      </div>
    );
  }
}

export default function TestPage() {
  return (
    <div>
      <h1>TestPage</h1>
      <Suspense fallback={<div>로딩 중...</div>}>
        <MarketData />
      </Suspense>
    </div>
  );
}