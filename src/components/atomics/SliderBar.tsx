import { useRef, useState } from 'react';

const preventScroll = (e: Event) => {
  e.preventDefault();
};

interface Props {
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}
export default function SliderBar({ min, max, value, step = 1, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState<number>(value);
  const [percent, setPercent] = useState<number>(0);

  const handleSlide = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const percent = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const newValue = Math.round((min + percent * (max - min)) / step) * step;
    setInternalValue(newValue);
    setPercent(percent);
    onChange(newValue);
  };

  const handleMouseMove = (e: MouseEvent) => {
    requestAnimationFrame(() => {
      if (!ref.current) return;
      handleSlide(e.clientX);
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    requestAnimationFrame(() => {
      if (!ref.current) return;
      handleSlide(e.touches[0].clientX);
    });
  };

  const handleStart = () => {
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    if (window.matchMedia('(pointer: coarse)').matches) {
      document.body.style.overflow = 'hidden';
      document.body.addEventListener('touchmove', preventScroll, { passive: false });
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);
  };

  const handleEnd = () => {
    setIsDragging(false);
    document.body.style.overflow = 'auto';
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
    document.body.removeEventListener('touchmove', preventScroll);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleEnd);
  };

  return (
    <div
      ref={ref}
      className="relative flex items-center w-full h-full"
      onClick={(e) => handleSlide(e.clientX)}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <div className="relative w-full h-2 rounded-full overflow-hidden">
        <div className="w-full h-2 rounded-full layer1" />
        <div
          className="absolute top-0 -left-full w-full h-2 rounded-full bg-gradient-to-r from-indigo-600/60 to-indigo-400/60"
          style={{ transform: `translateX(${percent * 100}%)` }}
        />
      </div>
      <div className="absolute-center flex flex-center size-0" style={{ left: `${percent * 100}%` }}>
        <div
          className={`absolute size-4 bg-slate-200 rounded-full transition-all duration-300 ${isDragging ? 'scale-125' : ''}`}
        />
      </div>
    </div>
  );
}
