'use client';

import { useEffect, useRef } from 'react';
import useVisibility from '../useVisibility';

export default function useSocketManager(connect: () => void, disconnect: () => void, updateFlag?: string) {
  const isVisible = useVisibility({ wait: 5000 });
  const isPause = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    try {
      disconnect();
    } catch {
      //
    }
  }, [updateFlag]);

  useEffect(() => {
    if (isVisible) {
      if (isPause.current) {
        disconnect();
        console.log('[소켓] 연결 시작 useSocketManager');
        connect();
      }
    } else {
      disconnect();
      isPause.current = true;
    }
  }, [isVisible]);
}
