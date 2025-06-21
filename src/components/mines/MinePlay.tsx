'use client';

import MineApi from '@/apis/api/mines/MineApi';
import useToastMessageStore from '@/store/useToastMessageStore';
import MineRoom from '@/types/mines/MineRoom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createContext } from 'react';
import ExitButton from './ExitButton';
import MineComplete from './MineComplete';
import MazeMain from './maze/MazeMain';
import { secondsToTime } from './maze/utils';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 flex flex-col flex-center w-full h-[100dvh] pb-12">
      <div className="flex flex-col max-sm:w-full max-sm:max-w-156 sm:w-156 max-sm:px-4 max-md:pt-4 md:pt-8 gap-4 select-none">
        {children}
      </div>
    </div>
  );
};

interface MineContextType {
  round: number;
  setRound: (round: number) => void;
  time: number;
  setTime: (time: number) => void;
  onComplete: () => void;
}
export const MineContext = createContext<MineContextType>({
  round: 1,
  setRound: () => {},
  time: 0,
  setTime: () => {},
  onComplete: () => {},
});

interface Props {
  room: MineRoom;
  setRoom: (room: MineRoom) => void;
}
export default function MinePlay({ room, setRoom }: Props) {
  const [round, setRound] = useState<number>(1);
  const [time, setTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (!room.id) return;

    timerRef.current = null;
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    document.body.style.overflow = 'hidden';

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      document.body.style.overflow = 'auto';
    };
  }, [room]);

  const handleComplete = useCallback(async () => {
    if (!timerRef.current) return;

    clearInterval(timerRef.current);
    timerRef.current = null;

    const response = await MineApi.updateMineRoom(room.id, time);
    if (response.id) {
      setIsComplete(true);
      setRoom(response);
    } else {
      createToastMessage('오류가 발생했습니다. 다시 시도해주세요.');
      setRoom(new MineRoom());
    }
  }, [time]);

  return (
    <MineContext.Provider value={{ round, setRound, time, setTime, onComplete: handleComplete }}>
      <Layout>
        <div className="relative flex justify-between items-center w-full">
          <ExitButton action={() => setRoom(new MineRoom())} className="-translate-y-1" />

          <div className="absolute-center text-stone-100" onClick={() => handleComplete()}>
            <span className="text-2xl font-sinchon-rhapsody">라운드 {round}</span>
          </div>

          <div className="text-stone-200">
            <i className="fa-solid fa-stopwatch text-lg mr-2"></i>
            <span className="font-sinchon-rhapsody text-xl">{secondsToTime(time)}</span>
          </div>
        </div>

        <div className="relative w-full aspect-square">
          <MazeMain seed={room.seed} />
          {isComplete && <MineComplete room={room} setRoom={setRoom} />}
        </div>
      </Layout>
    </MineContext.Provider>
  );
}
