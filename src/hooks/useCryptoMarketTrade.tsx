import { CryptoMarketTradeContext } from '@/store/providers/CryptoMarketTradeProvider';
import { useContext } from 'react';

export const useCryptoMarketTrade = () => {
  const value = useContext(CryptoMarketTradeContext);

  if (!value) {
    throw new Error('useCryptoMarketTrade must be used within a CryptoMarketTradeProvider');
  }

  return value;
};
