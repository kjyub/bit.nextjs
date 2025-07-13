'use client';

import type Pagination from '@/types/api/pagination';
import MineRoom from '@/types/mines/MineRoom';
import { useEffect, useState } from 'react';
import MinePlay from './MinePlay';
import MineLobby from './lobby';
import MineTitle from './MineTitle';
import MineHistory from './history';

export type PageType = 'lobby' | 'room';

export default function MineMain() {
  const [pageType, setPageType] = useState<PageType>('lobby');
  const [room, setRoom] = useState<MineRoom>(new MineRoom());

  useEffect(() => {
    setPageType(room.id ? 'room' : 'lobby');
  }, [room.id]);

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {pageType === 'lobby' && (
        <>
          <MineTitle />
          <MineLobby setRoom={setRoom} />
          <MineHistory />
        </>
      )}
      {pageType === 'room' && <MinePlay room={room} setRoom={setRoom} />}
    </div>
  );
}
