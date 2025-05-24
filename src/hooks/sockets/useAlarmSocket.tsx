import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import useToastMessageStore from '@/store/useToastMessageStore';
import useUserInfoStore from '@/store/useUserInfo';
import { useEffect } from 'react';
import { useUser } from '../useUser';

export default function useAlarmSocket() {
  const { user } = useUser();

  // 유저 거래 정보 알람
  const userInfoUpdate = useUserInfoStore((state) => state.updateInfo);
  const addToastMessage = useToastMessageStore((state) => state.addMessage);

  useEffect(() => {
    const userAlarmSocket = TradeGoApi.getAlarmSocket(user.id);
    if (userAlarmSocket) {
      userAlarmSocket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string);
          addToastMessage(String(data.content));
          userInfoUpdate();
        } catch (error) {
          console.log('Failed to parse WebSocket message', error);
        }
      };
    }

    return () => {
      if (userAlarmSocket) {
        userAlarmSocket.close();
      }
    };
  }, [user.id]);
}
