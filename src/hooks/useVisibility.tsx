import { useEffect, useRef, useState } from 'react';

export default function useVisibility({ wait = 0 }: { wait?: number }) {
  const [isRealVisible, setIsRealVisible] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsRealVisible(true);
      } else {
        setIsRealVisible(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isRealVisible) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      setIsVisible(true);
    } else {
      timer.current = setTimeout(() => {
        if (timer.current) {
          setIsVisible(false);
        }
      }, wait);
    }
  }, [isRealVisible]);

  return isVisible;
}
