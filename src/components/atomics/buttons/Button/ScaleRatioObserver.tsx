import { useEffect, useRef } from 'react';

const getScaleRatio = (width: number, scaleSize: number) => {
  return 1 - scaleSize / width;
};

export function ScaleRatioObserver({
  scaleSize,
  setScaleRatio,
}: {
  scaleSize: number;
  setScaleRatio: React.Dispatch<React.SetStateAction<number>>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const observer = new ResizeObserver((entries) => {
        let width = 0;
        for (const entry of entries) {
          width = entry.contentRect.width;
        }
        setScaleRatio(getScaleRatio(width, scaleSize));
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, []);

  return <div ref={ref} className="size-full absolute inset-0 opacity-0 pointer-events-none" />;
}
