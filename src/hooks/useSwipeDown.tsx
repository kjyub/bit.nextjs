import { useEffect, useRef } from "react";

export default function useSwipeDown(action: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleSwipeDown = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      
      if (e.defaultPrevented) return;

      const touch = e.touches[0];
      const startY = touch.clientY;

      const handleMove = (e: TouchEvent) => {
        if (e.defaultPrevented) return;
        
        const touch = e.touches[0];
        const currentY = touch.clientY;
        const deltaY = currentY - startY;

        if (deltaY > 200) {
          action();
        }
      }

      ref.current?.addEventListener('touchmove', handleMove);

      return () => {
        ref.current?.removeEventListener('touchmove', handleMove);
      }
    }

    ref.current?.addEventListener('touchstart', handleSwipeDown);

    return () => {
      ref.current?.removeEventListener('touchstart', handleSwipeDown);
    }
  }, []);

  return ref;
}