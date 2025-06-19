'use client';

import MineApi from "@/apis/api/mines/MineApi";
import { useUser } from "@/hooks/useUser"
import useToastMessageStore from "@/store/useToastMessageStore";
import type MineRoom from "@/types/mines/MineRoom";
import { cn } from "@/utils/StyleUtils";
import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface Props {
  setRoom: (room: MineRoom) => void;
}
export default function MinePlayButtonBox({ setRoom }: Props) {
  const { user, isAuth } = useUser();
  const { createMessage } = useToastMessageStore();
  const [isLoading, setIsLoading] = useState(false);

  const verifyRef = useRef<HCaptcha>(null);
  const verifiedRef = useRef<boolean>(false);

  const handlePlay = async () => {
    if (isLoading) return;

    if (!isAuth) {
      createMessage('로그인 후 이용해주세요');
      return;
    }

    setIsLoading(true);
    const errorMessage = await MineApi.validateMineRoom();
    if (errorMessage) {
      createMessage(errorMessage);
      return;
    }

    const mineRoom = await MineApi.createMineRoom({
      user_id: user.id,
    });

    if (!verifiedRef.current) {
      createMessage('자동 로봇 방지 체크를 통과해주세요');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    if (mineRoom) {
      setRoom(mineRoom);
      return;
    }

    createMessage('방 생성 실패');
  }

  return (
    <div className="flex flex-col flex-center w-full gap-4">
      <ul className="flex flex-col px-8 py-4 gap-1 text-stone-400 [&>li]:mouse:hover:text-stone-300 text-sm rounded-lg border border-stone-500/50 list-disc">
        <li>자산이 10만 이하 그리고 보유 중인 코인이 없어야 진행 가능합니다</li>
        <li>모든 라운드를 진행해야 보상을 얻으실 수 있습니다</li>
      </ul>
      <button
        type="button"
        className={cn([
          'px-8 py-4 bg-orange-700/70 text-stone-200 text-xl font-bold rounded-3xl duration-200',
          { 'py-3 animate-bounce': isLoading },
          { 'active:translate-y-3 active:py-3': !isLoading },
        ])}
        onClick={handlePlay}
      >
        입장하기
      </button>
      <HCaptcha
        
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ? process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY : ""}
        onVerify={(token) => {
          verifiedRef.current = true;
        }}
      />
    </div>
  )
}