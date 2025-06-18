import { useEffect, useRef, useState } from 'react';

export const useDetectClose = <T extends HTMLElement>(): [
  React.MutableRefObject<T | null>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const ref = useRef<T | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const pageClickEvent = (e: MouseEvent) => {
      console.log(ref.current, e.target)
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(!isOpen);
      }
    };

    let eventElement: Window | Element = window;

    // Portal 모달 내에서 사용되는 경우 클릭 이벤트 타겟을 window로 잡을 수 없다.
    try {
      const isPortalModalElement = ref.current?.closest('.ReactModalPortal');
      if (isPortalModalElement) {
        // PortalModal인 경우
        eventElement = isPortalModalElement;
      }
    } catch {
      //
    }

    if (isOpen) {
      eventElement.addEventListener('click', pageClickEvent as EventListener);
    }

    return () => {
      eventElement.removeEventListener('click', pageClickEvent as EventListener);
    };
  }, [isOpen, ref]);

  return [ref, isOpen, setIsOpen];
};
