import NextUpbitApi from '@/apis/api/cryptos/NextUpbitApi';
import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';

export default async function TestPage() {
  const result = await TradeGoApi.getMarketCurrent('KRW-BTC');
  return (
    <div>
      <h1>TestPage</h1>
      <p>{result.code}</p>
      <span>{result.trade_price}</span>
    </div>
  );
}