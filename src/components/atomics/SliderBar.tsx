import { useRef, useState } from 'react';

interface Props {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}
export default function SliderBar({ min, max, value, step = 1, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const [internalValue, setInternalValue] = useState<number>(value);
  const [percent, setPercent] = useState<number>(0);

  const handleStart = () => {
    isDraggingRef.current = true;
    document.body.style.overflow = 'hidden';
  };

  const handleEnd = () => {
    isDraggingRef.current = false;
    document.body.style.overflow = 'auto';
  };

  const handleMove = (clientX: number) => {
    requestAnimationFrame(() => {
      if (!ref.current || !isDraggingRef.current) return;
      const rect = ref.current.getBoundingClientRect();
      const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const newValue = Math.round((min + percent * (max - min)) / step) * step;
      setInternalValue(newValue);
      setPercent(percent);
      onChange(newValue);
    });
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center w-full h-full"
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <div className="relative w-full h-2 rounded-full overflow-hidden">
        <div className="w-full h-2 rounded-full layer1" />
        <div
          className="absolute top-0 -left-full w-full h-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
          style={{ transform: `translateX(${percent * 100}%)` }}
        />
      </div>
      <div className="absolute-center size-4 bg-slate-200 rounded-full" style={{ left: `${percent * 100}%` }} />
    </div>
  );
}
