import useMarketPriceStore from '@/store/useMarketPriceStore';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import useVisibility from '../useVisibility';

export default function useTradeMarketSocket() {
  const { initMarketPriceData, connectSocket, disconnectSocket } = useMarketPriceStore(
    useShallow((state) => ({
      initMarketPriceData: state.initMarketPriceData,
      connectSocket: state.connectSocket,
      disconnectSocket: state.disconnectSocket,
    })),
  );
  const isVisible = useVisibility({ wait: 1000 });

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      initMarketPriceData();
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [isVisible]);
}
