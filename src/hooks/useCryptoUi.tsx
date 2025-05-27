import { CryptoContext } from '@/store/providers/CryptoProvider';
import { useContext } from 'react';

export const useCryptoUi = () => {
  const value = useContext(CryptoContext);

  if (!value) {
    throw new Error('useCryptoUi must be used within a CryptoProvider');
  }

  return {
    isShowMarketList: value.isShowMarketList,
    setIsShowMarketList: value.setIsShowMarketList,
  };
};
