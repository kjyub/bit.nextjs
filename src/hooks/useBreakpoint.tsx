'use client';
import BrowserUtils from '@/utils/BrowserUtils';
import { debounce } from 'lodash';
import { useLayoutEffect, useState } from 'react';

export const breakpoints = {
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

const getBreakpointState = (): BreakpointState => {
  return Object.fromEntries(
    Object.entries(breakpoints).map(([key, breakpoint]) => [
      key,
      window.matchMedia(`(min-width: ${breakpoint}px)`).matches,
    ]),
  ) as BreakpointState;
};

const useBreakpoint = (): { breakpointState: BreakpointState; width: number } => {
  const [width, setWidth] = useState(0);
  const [breakpointState, setBreakpointState] = useState<BreakpointState>(initialBreakpointState);

  useLayoutEffect(() => {
    setBreakpointState(getBreakpointState());

    const onResize = debounce(() => {
      setWidth(window.innerWidth);
      setBreakpointState(getBreakpointState());
    }, 500);

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return { breakpointState, width };
};

export default useBreakpoint;
