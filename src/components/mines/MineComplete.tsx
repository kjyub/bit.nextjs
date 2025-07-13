import MineApi from '@/apis/api/mines/MineApi';
import { useUser } from '@/hooks/useUser';
import MineRoom from '@/types/mines/MineRoom';
import { useState } from 'react';
import CountUp from 'react-countup';

interface Props {
  room: MineRoom;
  setRoom: (room: MineRoom) => void;
}
export default function MineComplete({ room, setRoom }: Props) {
  const { isAuth } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [nickname, setNickname] = useState(room.nickname);

  const handleComplete = async () => {
    if (!isAuth) {
      await MineApi.updateMineRoomNickname(room.id, nickname);
    }

    setRoom(new MineRoom());
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-center w-full h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-stone-900/30 duration-300">
      <div className="flex flex-col flex-center max-sm:w-[80vw] sm:w-96 h-64 gap-4 rounded-xl bg-stone-400 border border-stone-500/50 shadow-lg animate-fade-pop">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-sinchon-rhapsody">완료!</span>
          <span className="text-stone-700">노역을 완료했습니다!</span>
        </div>

        {isAuth ? (
          <span className="text-stone-100 text-lg">
            <CountUp start={0} end={room.reward} duration={2} prefix="+" suffix=" W" onEnd={() => setIsActive(true)} />
          </span>
        ) : (
          <div className="flex flex-col w-48 gap-1">
            <span className="text-xs text-stone-100">기록에 저장할 이름을 바꾸시겠습니까?</span>
            <input 
              type="text"
              className="w-48 h-10 rounded-xl bg-stone-500/50 text-stone-100 border border-stone-500/50 px-2 text-sm"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={8}
            />
          </div>
        )}

        {(isActive || !isAuth) && (
          <button
            type="button"
            className="px-6 h-10 rounded-xl bg-orange-700/70 text-stone-100 font-medium mouse:hover:scale-105 active:scale-95 duration-200"
            onClick={handleComplete}
          >
            완료하기
          </button>
        )}
      </div>
    </div>
  );
}
