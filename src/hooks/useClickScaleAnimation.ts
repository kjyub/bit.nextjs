import { useCallback, useEffect, useRef, useState } from 'react';

const ANIMATION_DURATION = 200;
const DEFAULT_SCALE_SIZE = 10;
const MOUSE_UP_DELAY = 100;

interface UseClickScaleAnimationOptions {
  animationDuration?: number;
  scaleSize?: number;
}

const getScaleRatio = (width: number, scaleSize: number) => {
  return 1 - scaleSize / width;
};

export function useClickScaleAnimation<T extends HTMLElement>(options: UseClickScaleAnimationOptions = {}) {
  const { animationDuration = ANIMATION_DURATION, scaleSize = DEFAULT_SCALE_SIZE } = options;

  const [isActive, setIsActive] = useState(false);
  const [scaleRatio, setScaleRatio] = useState(1);
  const elementRef = useRef<T>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseDownTimeRef = useRef<number>(0);

  const handleMouseDown = useCallback(() => {
    // 기존 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    mouseDownTimeRef.current = Date.now();
    setIsActive(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    const pressDuration = Date.now() - mouseDownTimeRef.current;
    const remainingTime = Math.max(0, animationDuration - pressDuration - MOUSE_UP_DELAY);

    // requestAnimationFrame을 사용하여 더 정확한 타이밍 제어 (iOS 최적화)
    if (remainingTime > 0) {
      timeoutRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(() => {
          setIsActive(false);
          timeoutRef.current = null;
          rafRef.current = null;
        });
      }, remainingTime);
    } else {
      rafRef.current = requestAnimationFrame(() => {
        setIsActive(false);
        rafRef.current = null;
      });
    }
  }, [animationDuration]);

  const handleMouseLeave = useCallback(() => {
    const pressDuration = Date.now() - mouseDownTimeRef.current;
    const remainingTime = Math.max(0, animationDuration - pressDuration - MOUSE_UP_DELAY);

    // requestAnimationFrame을 사용하여 더 정확한 타이밍 제어 (iOS 최적화)
    if (remainingTime > 0) {
      timeoutRef.current = setTimeout(() => {
        rafRef.current = requestAnimationFrame(() => {
          setIsActive(false);
          timeoutRef.current = null;
          rafRef.current = null;
        });
      }, remainingTime);
    } else {
      rafRef.current = requestAnimationFrame(() => {
        setIsActive(false);
        rafRef.current = null;
      });
    }
  }, [animationDuration]);

  // 이벤트 리스너 등록
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('touchstart', handleMouseDown);
    element.addEventListener('touchend', handleMouseUp);
    element.addEventListener('touchcancel', handleMouseLeave);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('touchstart', handleMouseDown);
      element.removeEventListener('touchend', handleMouseUp);
      element.removeEventListener('touchcancel', handleMouseLeave);
    };
  }, [handleMouseDown, handleMouseUp, handleMouseLeave]);

  // Scale ratio 계산 (ResizeObserver)
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setScaleRatio(getScaleRatio(width, scaleSize));
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [scaleSize]);

  // 스타일 적용
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.style.transitionDuration = `${animationDuration}ms`;
    element.style.scale = isActive ? String(scaleRatio) : '1';
  }, [isActive, scaleRatio, animationDuration]);

  return {
    ref: elementRef,
    isActive,
  };
}
