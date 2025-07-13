import MineRoom from '@/types/mines/MineRoom';
import Link from 'next/link';
import { useState } from 'react';
import CountUp from 'react-countup';

interface Props {
  room: MineRoom;
  setRoom: (room: MineRoom) => void;
}
export default function MineComplete({ room, setRoom }: Props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="absolute inset-0 z-50 flex flex-center w-full h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-stone-900/30 duration-300">
      <div className="flex flex-col flex-center max-sm:w-[80vw] sm:w-96 h-56 gap-4 rounded-xl bg-stone-400 border border-stone-500/50 shadow-lg animate-fade-pop">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-sinchon-rhapsody">완료!</span>
          <span className="text-stone-700">노역을 완료했습니다!</span>
        </div>

        <span className="text-stone-100 text-lg">
          +<CountUp start={0} end={room.reward} duration={2} suffix=" W" onEnd={() => setIsActive(true)} />
        </span>

        {isActive && (
          <button
            type="button"
            className="px-6 h-10 rounded-xl bg-orange-700/70 text-stone-100 font-medium mouse:hover:scale-105 active:scale-95 duration-200"
            onClick={() => setRoom(new MineRoom())}
          >
            돌아가기
          </button>
        )}
      </div>
    </div>
  );
}
