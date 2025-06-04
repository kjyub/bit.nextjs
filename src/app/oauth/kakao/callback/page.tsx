'use client';

import { AccountStatusTypes } from '@/types/users/UserTypes';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useUser } from '@/hooks/useUser';
import * as SS from '@/styles/SignupStyles';

const SignupPage = () => {
  const { kakaoAuth, setUser } = useUser();

  const searchParams = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const router = useRouter();

  useEffect(() => {
    if (!code) {
      router.push('/');
    } else {
      handleLogin();
    }
  }, []);

  const handleLogin = async () => {
    const user = await kakaoAuth(code);
    setUser(user);

    if (!user.id) {
      alert('이용할 수 없는 계정입니다.');
      router.push('/');
      return;
    }

    // 이미 가입된 회원인 경우
    if (user.accountStatus === AccountStatusTypes.NORMAL) {
      router.push('/');
    } else if (user.accountStatus === AccountStatusTypes.TEMP) {
      router.push('/auth/signup');
    } else {
      alert('이용할 수 없는 계정입니다.');
      router.push('/');
    }
  };

  return (
    <SS.Layout>
      <SS.BoxContainer className="space-y-2">
        <div className="flex flex-col items-center md:w-128">
          <SS.Title>카카오 로그인 중...</SS.Title>
        </div>
      </SS.BoxContainer>
    </SS.Layout>
  );
};

export default SignupPage;
