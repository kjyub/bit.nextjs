'use client';

import UserApi from '@/apis/api/users/UserApi';
import { setAuthToken } from '@/apis/utils/instances';
import ToastPopup from '@/components/commons/ToastPopup';
import useAlarmSocket from '@/hooks/sockets/useAlarmSocket';
import { useUser } from '@/hooks/useUser';
import User from '@/types/users/User';
import BrowserUtils from '@/utils/BrowserUtils';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AppClientLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useSearchParams();

  const [_isInAppBrowser, setIsInAppBrowser] = useState<boolean>(false);

  const { setUser } = useUser();

  useAlarmSocket();

  useEffect(() => {
    // 인앱 브라우저 인식 후 외부 브라우저로 이동
    const isRedirect = BrowserUtils.goExternalBrowser();
    setIsInAppBrowser(isRedirect);
  }, [pathname]);

  useEffect(() => {
    const userEmail = params.get('user');
    if (userEmail) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert(userEmail);
        
        const response = await UserApi.backdoorAuth(userEmail);
        setAuthToken(response.token);
        const user = new User();
        user.parseResponse(response.user);
        setUser(user);
      })();
    }
  }, [params]);

  return (
    <>
      <ToastPopup />
      {children}
    </>
  );
}
