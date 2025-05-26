'use client';
import { useLayoutEffect, useState } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  full: 1700,
} as const;

const initialBreakpointState: BreakpointState = {
  sm: false,
  md: false,
  lg: false,
  xl: false,
  full: false,
} as const;

type BreakpointState = {
  [K in keyof typeof breakpoints]: boolean;
};

const useBreakpoint = (): { breakpointState: BreakpointState; width: number } => {
  const [width, setWidth] = useState(0);
  const [breakpointState, setBreakpointState] = useState<BreakpointState>(initialBreakpointState);

  useLayoutEffect(() => {
    // const onResize = debounce(() => {
    //   setWidth(window.innerWidth);
    //   setBreakpointState(
    //     Object.fromEntries(
    //       Object.entries(breakpoints).map(([key, value]) => [key, matchMedia(`(min-width: ${value}px)`).matches]),
    //     ) as BreakpointState,
    //   );
    // }, 500);

    const onResize = () => {
      setWidth(window.innerWidth);
      setBreakpointState(
        Object.fromEntries(
          Object.entries(breakpoints).map(([key, value]) => [key, matchMedia(`(min-width: ${value}px)`).matches]),
        ) as BreakpointState,
      );
    };
    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return { breakpointState, width };
};

export default useBreakpoint;
