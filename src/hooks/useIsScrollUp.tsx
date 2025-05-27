import { useEffect, useRef, useState } from 'react';

export const useIsScrollUp = () => {
  const [isScrollUp, setIsScrollUp] = useState(false);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      const isScrollDown = currentScroll > lastScrollRef.current; // 하행 중인지 여부
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight; // 페이지 맨 아래인지 여부
      const isAtTop = currentScroll <= 0; // 페이지 맨 위인지 여부

      setIsScrollUp(isScrollDown && !isAtBottom && !isAtTop);
      lastScrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isScrollUp;
};
