'use client';

import UserApi from '@/apis/api/users/UserApi';
import { removeAuthToken, setAuthToken } from '@/apis/utils/instances';
import User from '@/types/users/User';
import { AccountStatusTypes, type Token, type LoginResponse } from '@/types/users/UserTypes';
import { type Dispatch, type SetStateAction, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import useUserInfoStore from '../useUserInfo';

interface AuthState {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  isLoading: boolean;
  isAuth: boolean;
  kakaoAuth: (code: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const initAuthState: AuthState = {
  user: new User(),
  setUser: () => {},
  isLoading: true,
  isAuth: false,
  kakaoAuth: async () => new User(),
  signOut: async () => {},
};

export const AuthContext = createContext<AuthState>(initAuthState);

export const AuthProvider = ({
  authToken,
  userData,
  children,
}: {
  authToken: Token;
  userData: object;
  children: React.ReactNode;
}) => {
  const initialUser = useMemo(() => {
    const user = new User();
    user.parseResponse(userData as any);
    return user;
  }, [userData]);

  const [user, setUser] = useState<User>(initialUser);

  // 유저 데이터 가져오는데 성공했으면 이미 불러온 상태로 시작
  const [isAuth, setIsAuth] = useState<boolean>(!!userData && user.accountStatus === AccountStatusTypes.NORMAL);
  const [isLoading, setIsLoading] = useState<boolean>(!userData);

  const updateAuth = useUserInfoStore((state) => state.updateAuth);

  useEffect(() => {
    if (authToken && Object.keys(authToken).length > 0) {
      setAuthToken(authToken);
      if (userData) {
        const newUser = new User();
        newUser.parseResponse(userData as any);
        setUser(newUser);
      }

      getUser(true);
    }
  }, [authToken, userData]);

  useEffect(() => {
    setIsAuth(user.accountStatus === AccountStatusTypes.NORMAL);
  }, [user.accountStatus]);

  useEffect(() => {
    updateAuth(isAuth);
  }, [isAuth]);

  const getUser = useCallback(
    async (isLoadingDisable = false) => {
      if (!isLoadingDisable) {
        setIsLoading(true);
      }

      const result = await UserApi.getUserCurrent();
      setUser(result);

      setIsLoading(false);
    },
    [setIsLoading, setUser],
  );

  const kakaoAuth = useCallback(
    async (code: string) => {
      const response = await fetch(`/api/auth/kakao?code=${code}`);
      const result = (await response.json()) as LoginResponse;

      if (!result.token.access) {
        throw new Error('로그인에 실패했습니다.');
      }

      setAuthToken(result.token);

      const newUser = new User();
      newUser.parseResponse(result.user);
      setUser(newUser);

      return newUser;
    },
    [setUser],
  );

  const signOut = useCallback(async () => {
    setUser(new User());
    setIsLoading(false);
    removeAuthToken();
  }, [setUser, setIsLoading]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, isAuth, kakaoAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
