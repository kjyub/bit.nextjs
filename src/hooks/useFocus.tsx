import { useEffect, useRef, useState } from 'react';

export default function useFocus() {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [ref]);

  return {
    isFocused,
    ref,
  };
}
