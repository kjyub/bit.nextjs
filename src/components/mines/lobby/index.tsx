'use client';

import MineApi from '@/apis/api/mines/MineApi';
import { useUser } from '@/hooks/useUser';
import useToastMessageStore from '@/store/useToastMessageStore';
import { GameTypes, type GameType } from '@/types/mines/MineTypes';
import type MineRoom from '@/types/mines/MineRoom';
import { useState } from 'react';
import StackFilpper from './StackFilpper';
import Mode from './Mode';

interface Props {
  setRoom: (room: MineRoom) => void;
}
export default function MineLobby({ setRoom }: Props) {
  const { user, isAuth } = useUser();
  const { createMessage } = useToastMessageStore();
  const [loadingGame, setLoadingGame] = useState<GameType>(GameTypes.NONE);

  const handlePlay = async (gameType: GameType, isPractice: boolean) => {
    if (loadingGame) return;

    if (!isAuth && !isPractice) {
      createMessage('로그인 후 이용해주세요');
      return;
    }

    setLoadingGame(gameType);

    // 실전모드일 때만 검증
    if (!isPractice) {
      const errorMessage = await MineApi.validateMineRoom();
      if (errorMessage) {
        createMessage(errorMessage);
        setLoadingGame(GameTypes.NONE);
        return;
      }
    }

    const mineRoom = await MineApi.createMineRoom({
      user_id: isAuth ? user.id : null,
      game_type: gameType,
      is_practice: isPractice,
    });

    setLoadingGame(GameTypes.NONE);

    if (mineRoom.id) {
      setRoom(mineRoom);
      return;
    }

    createMessage('방 생성 실패');
  };

  return (
    <div className="flex flex-col flex-center w-full gap-4">
      <StackFilpper.Wrapper className="max-sm:w-[80vw] max-sm:h-72 sm:w-96 sm:h-96">
        {/* 연습모드 */}
        <StackFilpper.Item index={0}>
          <Mode title="연습모드" loadingGame={loadingGame} handlePlay={(gameType) => handlePlay(gameType, true)}>
            <ul className="flex flex-col px-8 py-4 gap-1 text-stone-400 [&>li]:mouse:hover:text-stone-300 text-sm rounded-lg border border-stone-500/50 list-disc">
              <li>조건없이 아무때나 진행 가능합니다</li>
              <li>보상은 지급되지 않습니다</li>
            </ul>
          </Mode>
        </StackFilpper.Item>
        {/* 실전모드 */}
        <StackFilpper.Item index={1}>
          <Mode title="실전모드" loadingGame={loadingGame} handlePlay={(gameType) => handlePlay(gameType, false)}>
            <ul className="flex flex-col px-8 py-4 gap-1 text-stone-400 [&>li]:mouse:hover:text-stone-300 text-sm rounded-lg border border-stone-500/50 list-disc">
              <li>자산이 10만 이하 그리고 보유 중인 코인이 없어야 진행 가능합니다</li>
              <li>모든 라운드를 진행해야 보상을 얻으실 수 있습니다</li>
            </ul>
          </Mode>
        </StackFilpper.Item>
      </StackFilpper.Wrapper>
    </div>
  );
}