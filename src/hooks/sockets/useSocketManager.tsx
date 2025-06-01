'use client';

import { useEffect, useRef } from 'react';
import useVisibility from '../useVisibility';

export default function useSocketManager(
  connect: () => void,
  disconnect: () => void,
  updateFlag?: string,
) {
  const isVisible = useVisibility({ wait: 5000 });
  const isPause = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      disconnect()
    };
  }, []);

  useEffect(() => {
    try {
      disconnect()
    } catch {
      //
    }
    
    connect()
  }, [updateFlag]);

  useEffect(() => {
    if (isVisible) {
      if (isPause.current) {
        disconnect()
        connect()
      }
    } else {
      disconnect()
      isPause.current = true;
    }
  }, [isVisible]);
}
