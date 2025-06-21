import { useEffect, useRef } from 'react';

const MARGIN = 10;

export function useConstrainedAbsolutePosition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function adjustPosition() {
      const el = ref.current;
      if (!el || !el.offsetParent) return;

      const childEl = el.firstElementChild as HTMLElement;
      if (!childEl) return;

      const childRect = childEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // 왼쪽이 화면을 넘친 경우
      if (childRect.left < 0) {
        el.style.left = `${el.offsetLeft - childRect.left + MARGIN}px`;
      }
      // 오른쪽이 화면을 넘친 경우
      else if (childRect.right > viewportWidth) {
        const overflow = childRect.right - viewportWidth;
        el.style.left = `${el.offsetLeft - overflow - MARGIN}px`;
      }
      // 화면을 넘지 않은 경우 아무 처리도 하지 않음
    }

    adjustPosition();
    window.addEventListener('resize', adjustPosition);
    return () => window.removeEventListener('resize', adjustPosition);
  }, []);

  return ref;
}
