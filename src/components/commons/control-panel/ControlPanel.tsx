'use client';

import { cn } from "@/utils/StyleUtils";
import MessageList from "./MessageList";
import ControlButton from "./ControlButton";
import { useUser } from "@/hooks/useUser";
import ChartColorButton from "./ChartColorButton";
import { use } from "react";
import { UiContext } from "@/store/providers/UiProvider";

export default function ControlPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { signOut } = useUser();
  const { chartColor, setChartColor } = use(UiContext);

  return (
    <div
      className={cn([
        'absolute z-60 top-14 right-0 common-panel backdrop-blur-xl rounded-3xl',
        'flex flex-col w-96 h-128 p-5 gap-4',
        { 'opacity-100 translate-y-0': isOpen },
        { 'opacity-0 -translate-y-4 pointer-events-none': !isOpen },
        'transition-all duration-300'
      ])}
    >
      <MessageList
        className="w-full flex-1"
        isOpen={isOpen}
        onClose={onClose}
      />

      <div className="flex justify-between items-end">
        <div className="flex flex-col justify-end gap-1">
          <span className="text-xs text-slate-200/80">차트 색상</span>
          <div className="flex flex-1 gap-1">
            <ChartColorButton
              riseColor="red"
              fallColor="blue"
              className="h-9"
              isActive={chartColor === "red-blue"}
              onClick={() => setChartColor("red-blue")}
            />
            <ChartColorButton
              riseColor="green"
              fallColor="red"
              className="h-9"
              isActive={chartColor === "green-red"}
              onClick={() => setChartColor("green-red")}
            />
          </div>
        </div>
        <ControlButton className="px-6 h-9 text-sm" onClick={signOut}>
          로그아웃
        </ControlButton>
      </div>
    </div>
  )
}