import TradeGoApi from '@/apis/api/cryptos/TradeGoApi';
import useToastMessageStore from '@/store/useToastMessageStore';
import useUserInfoStore from '@/store/useUserInfo';
import { useEffect } from 'react';
import { useUser } from '../useUser';

export default function useAlarmSocket() {
  const { user } = useUser();

  // 유저 거래 정보 알람
  const userInfoUpdate = useUserInfoStore((state) => state.updateInfo);
  const createToastMessage = useToastMessageStore((state) => state.createMessage);

  useEffect(() => {
    const userAlarmSocket = TradeGoApi.getAlarmSocket(user.id);
    if (userAlarmSocket) {
      userAlarmSocket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string);
          createToastMessage(String(data.content));
          userInfoUpdate();
        } catch (error) {
          console.log('Failed to parse WebSocket message', error);
        }
      };

      userAlarmSocket.onopen = () => {
        console.log('[알람] 연결 시작');
      };

      userAlarmSocket.onclose = () => {
        console.log('[알람] 연결 종료');
      };

      userAlarmSocket.onerror = (event) => {
        console.error('[알람] WebSocket error:', event);
      };
    }

    return () => {
      if (userAlarmSocket) {
        userAlarmSocket.close();
      }
    };
  }, [user.id]);
}
