import useMarketPriceStore from '@/store/useMarketPriceStore';
import useToastMessageStore from '@/store/useToastMessageStore';
import { useEffect, useState } from 'react';
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
  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  const isVisible = useVisibility({ wait: 1000 });

  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    setIsInitialized(true);
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      initMarketPriceData();
      connectSocket();

      if (isInitialized) {
        createToastMessage('시세 데이터 연결 완료');
      }
    } else {
      disconnectSocket();
    }
  }, [isVisible]);
}
