'use client';

import useTradeMarketSocket from '@/hooks/sockets/useTradeMarketSocket';

export default function CryptoClientLayout() {
  useTradeMarketSocket();
}
