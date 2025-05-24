'use client';

import { removeAxiosAuthToken, setAxiosAuthToken } from '@/apis/utils/clientApis';
import User from '@/types/users/User';
import { useSession } from 'next-auth/react';
import { createContext, useEffect, useState } from 'react';

interface AuthState {
  user: User;
  isLoading: boolean;
}

const initAuthState: AuthState = {
  user: new User(),
  isLoading: true,
};

export const AuthContext = createContext<AuthState>(initAuthState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<User>(new User());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session?.user) {
      const _user = new User();
      _user.parseResponse(session.user);
      setUser(_user);
      setIsLoading(false);
      setAxiosAuthToken(session.accessToken);
    } else {
      setUser(new User());
      setIsLoading(false);
      removeAxiosAuthToken();
    }
  }, [status]);

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
};
