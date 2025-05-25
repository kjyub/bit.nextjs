"use client";

import UserApi from "@/apis/api/users/UserApi";
import { removeAxiosAuthToken, setAxiosAuthToken } from "@/apis/utils/api";
import User from "@/types/users/User";
import { AccountStatusTypes, LoginResponse } from "@/types/users/UserTypes";
import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";

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
  kakaoAuth: async () => {},
  signOut: async () => {},
};

export const AuthContext = createContext<AuthState>(initAuthState);

export const AuthProvider = ({
  accessToken,
  userData,
  children,
}: {
  accessToken: string;
  userData: object;
  children: React.ReactNode;
}) => {
  const initialUser = useMemo(() => {
    const user = new User();
    user.parseResponse(userData as object);
    return user;
  }, [userData]);

  const [user, setUser] = useState<User>(initialUser);

  // 유저 데이터 가져오는데 성공했으면 이미 불러온 상태로 시작
  const [isAuth, setIsAuth] = useState<boolean>(userData);
  const [isLoading, setIsLoading] = useState<boolean>(!userData);

  useEffect(() => {
    if (accessToken) {
      setAxiosAuthToken(accessToken);
      if (userData) {
        const newUser = new User();
        newUser.parseResponse(userData as object);
        setUser(newUser);
      }
      getUser(true);
    }
  }, [accessToken, userData]);

  useEffect(() => {
    setIsAuth(user.accountStatus === AccountStatusTypes.NORMAL);
  }, [user.accountStatus]);

  const getUser = useCallback(
    async (isLoadingDisable: boolean = false) => {
      if (!isLoadingDisable) {
        setIsLoading(true);
      }

      const result = await UserApi.getUserCurrent();
      setUser(result);

      setIsLoading(false);
    },
    [setIsLoading, setUser]
  );

  const kakaoAuth = useCallback(
    async (code: string) => {
      const response = await fetch("/api/auth?code=" + code);
      const result = (await response.json()) as LoginResponse;

      if (!result.token.access) {
        throw new Error("로그인에 실패했습니다.");
      }

      setAxiosAuthToken(result.token.access);

      const newUser = new User();
      newUser.parseResponse(result.user);
      setUser(newUser);

      return newUser;
    },
    [setUser]
  );

  const signOut = useCallback(async () => {
    setUser(new User());
    setIsLoading(false);
    removeAxiosAuthToken();
  }, [setUser, setIsLoading]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, isAuth, kakaoAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
