import type React from 'react';
import { create } from 'zustand';

export interface SystemMessage {
  key: number;
  type: 'alert' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
  content: string | React.ReactNode;
}

interface ISystemMessageStore {
  messages: SystemMessage[];
  createMessage: (data: Omit<SystemMessage, 'key'>) => void;
  deleteMessage: (key: number) => void;
}
const useSystemMessageStore = create<ISystemMessageStore>((set) => ({
  messages: [],
  createMessage: (data: Omit<SystemMessage, 'key'>) => {
    const timestamp = new Date().getTime();

    const message: SystemMessage = {
      key: timestamp,
      ...data,
    };

    // 메세지 추가
    set((state) => ({
      messages: [message, ...state.messages.filter((m) => m.key !== message.key)],
    }));
  },
  deleteMessage: (key: number) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.key !== key),
    }));
  },
}));

export default useSystemMessageStore;
