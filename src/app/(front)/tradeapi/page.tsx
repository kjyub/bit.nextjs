import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import { Suspense } from 'react';

async function MarketData() {
  try {
    const result = await TradeGoApi.getMarketCurrent('KRW-BTC');
    return (
      <div>
        <p>{result.code}</p>
        <span>{result.trade_price}</span>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-red-500">
        데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
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