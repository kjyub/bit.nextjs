'use client';

import { useEffect, useRef, useState } from 'react';
import './style.css';

export default function TodayMarketTitleWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col px-1 gap-3">
      <div className="flex items-center justify-center gap-2">{children}</div>

      <Border />
    </div>
  );
}

const Border = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const handleMouseMove = (e: MouseEvent) => {
      // 컨테이너 0,0 기준으로 마우스 위치 계산, 컨테이너에서 어느정도 멀어지면 보이지않고 계산도 하지않음 (y는 마진이 매우 크게)
      const scrollY = window.scrollY;
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top + scrollY;
      const margin = containerRect.width / 4;

      if (x < 0 - margin || x > containerRect.width + margin || y < 0 - margin || y > containerRect.height + margin) {
        setPosition({ x: -1000, y: -1000 });
        return;
      }

      const offset = containerRect.width / 4;
      setPosition({ x: x - offset, y: y - offset });
    };

    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (!isTouch) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-center w-full h-[2px] bg-surface-sub-background overflow-hidden text-violet-600"
    >
      <div
        className="glow-ring will-change-transform"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      />
    </div>
  );
};
