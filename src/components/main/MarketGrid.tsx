'use client';

import type { IUpbitMarketTicker } from '@/types/cryptos/CryptoInterfaces';
import { use, useEffect, useRef, useState } from 'react';
import './style.css';
import { cn } from '@/utils/StyleUtils';

export default function MarketGrid({ getMarketsPromise }: { getMarketsPromise: Promise<IUpbitMarketTicker[]> }) {
  const markets = use(getMarketsPromise);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('h2');

    const onPointerMove = (pointer: { x: number; y: number }) => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;

        const b = pointer.x - centerX;
        const a = pointer.y - centerY;
        const c = Math.sqrt(a * a + b * b) || 1;

        // 거리 기반 회전 강도 계산 (가까울수록 강하게)
        const maxDistance = 200; // 최대 영향 거리 (px)
        const maxRotation = 30; // 최대 회전각도 (deg)
        const rotationStrength = Math.max(0, (maxDistance - c) / maxDistance);

        // 간단하게 거리에만 비례하는 회전각도 (0~30도)
        const r = rotationStrength * maxRotation;

        item.style.transform = `rotate(${r}deg)`;
      });
    };

    window.addEventListener('pointermove', onPointerMove);

    if (items.length) {
      const middleIndex = Math.floor(items.length / 2);
      const rect = items[middleIndex].getBoundingClientRect();
      onPointerMove({ x: rect.x, y: rect.y });
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid-box absolute z-0 size-full grid max-sm:grid-cols-4 max-md:grid-cols-5 max-lg:grid-cols-6 max-xl:grid-cols-7 xl:grid-cols-8 text-surface-sub-text/30 blur-[1px] select-none"
    >
      {markets.map((market) => (
        <MarketGridItem key={market.code} market={market} />
      ))}
    </div>
  );
}

const MarketGridItem = ({ market }: { market: IUpbitMarketTicker }) => {
  const [isActive, setIsActive] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const randomX = Math.random() * 45 - 27;
    const randomY = Math.random() * 45 - 27;
    setTranslate({ x: randomX, y: randomY });

    setTimeout(() => {
      setIsActive(true);
    }, Math.random() * 3000);
  }, []);

  return (
    <div
      className={cn('flex flex-center aspect-video origin-center will-change-transform', {
        'market-grid-cloud': isActive,
      })}
      style={{
        transform: `translate(${translate.x}px, ${translate.y}px)`,
      }}
    >
      <h2>{market.code.split('-')[1]}</h2>
    </div>
  );
};
