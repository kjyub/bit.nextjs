'use client';

import MineApi from '@/apis/api/mines/MineApi';
import usePageScroll from '@/hooks/usePageScroll';
import { TextFormats } from '@/types/CommonTypes';
import type { StyleProps } from '@/types/StyleTypes';
import type Pagination from '@/types/api/pagination';
import type MineRoom from '@/types/mines/MineRoom';
import CommonUtils from '@/utils/CommonUtils';
import { cn } from '@/utils/StyleUtils';
import { useEffect, useRef, useState } from 'react';
import tw from 'tailwind-styled-components';
import { secondsToTime } from '../maze/utils';

const PAGE_SIZE = 10;

const OnlyMineButton = tw.button<StyleProps>`
  px-3 py-1 
  rounded-xl mouse:hover:bg-stone-700/50 active:bg-stone-700/50
  text-sm text-stone-300
  transition-colors
  ${({ $is_active }) => $is_active && 'bg-stone-700/70'}
`;

export default function MineHistory() {
  const [onlyMine, setOnlyMine] = useState(true);
  const [mineHistory, setMineHistory] = useState<MineRoom[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [itemCount, setItemCount] = useState(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const isShowRef = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      await getMineHistory(1, onlyMine);
      setIsShow(isShowRef.current);
    })();
  }, []);

  const getMineHistory = async (_pageIndex: number, _onlyMine: boolean) => {
    if (isLoading) {
      return;
    }

    setLoading(true);
    const response = await MineApi.getMineRooms(_pageIndex, PAGE_SIZE, _onlyMine);

    if (_pageIndex === 1) {
      setMineHistory(response.items);
    } else {
      setMineHistory([...mineHistory, ...response.items]);
    }
    setPageIndex(response.pageIndex >= 0 ? response.pageIndex : _pageIndex);
    setItemCount(response.count);
    setOnlyMine(_onlyMine);
    setLoading(false);

    isShowRef.current = response.count > 0;
  };

  const handleNextPage = () => {
    getMineHistory(pageIndex + 1, onlyMine);
  };

  const scrollRef = usePageScroll<HTMLDivElement>({
    nextPage: handleNextPage,
    pageIndex: pageIndex,
    itemCount: itemCount,
    pageSize: PAGE_SIZE,
  });

  return (
    <div
      className={cn(['flex flex-col max-sm:w-full sm:w-108 mt-16 mb-24 gap-2 duration-200', { 'opacity-0': !isShow }])}
    >
      <div className="flex justify-between items-center w-full">
        <span className="font-semibold text-stone-300">노역록</span>

        <div className="flex gap-1">
          <OnlyMineButton type="button" $is_active={onlyMine} onClick={() => getMineHistory(1, true)}>
            내 기록만
          </OnlyMineButton>
          <OnlyMineButton type="button" $is_active={!onlyMine} onClick={() => getMineHistory(1, false)}>
            전체 기록
          </OnlyMineButton>
        </div>
      </div>

      <div className="flex flex-col w-full min-h-24 max-h-[90dvh] gap-1 divide-y divide-stone-800 overflow-y-auto scroll-transparent">
        {mineHistory.map((room) => (
          <div key={room.id} className="flex flex-col justify-center w-full px-2 py-4 gap-2">
            <div className="flex justify-between items-baseline w-full">
              <span className="text-[13px] text-stone-400">{room.user.nickname}</span>
              <span className="text-xs text-stone-500">{CommonUtils.getDateShorten(room.createdDate)}</span>
            </div>
            <div className="flex justify-between items-center w-full font-medium">
              <span className="text-stone-300">+{CommonUtils.textFormat(room.reward, TextFormats.NUMBER)}W</span>
              <span className="flex items-center text-stone-300">
                <i className="fa-solid fa-stopwatch text-sm mr-1"></i>
                {secondsToTime(room.playTime)}
              </span>
            </div>
          </div>
        ))}

        <div ref={scrollRef} className="h-1" />
      </div>
    </div>
  );
}
