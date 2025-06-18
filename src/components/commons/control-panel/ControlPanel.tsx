'use client';

import { cn } from "@/utils/StyleUtils";
import MessageList from "./MessageList";
import ControlButton from "./ControlButton";
import { useUser } from "@/hooks/useUser";

export default function ControlPanel({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { signOut } = useUser();

  return (
    <div
      className={cn([
        'absolute z-60 top-10 right-0 common-panel backdrop-blur-xl',
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

      <div className="flex justify-end">
        <ControlButton className="px-6 py-2 text-sm" onClick={signOut}>
          로그아웃
        </ControlButton>
      </div>
    </div>
  )
}