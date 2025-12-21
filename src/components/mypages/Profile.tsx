'use client';

import UserApi from '@/apis/api/users/UserApi';
import * as I from '@/components/inputs/UserInputs';
import { useUser } from '@/hooks/useUser';
import useToastMessageStore from '@/store/useToastMessageStore';
import { cn } from '@/utils/StyleUtils';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

interface ProfileState {
  nickname: string;
}

export default function Profile() {
  const router = useRouter();
  const { user, setUser, reloadUser, isAuth } = useUser();
  const { createMessage } = useToastMessageStore();

  useEffect(() => {
    if (!isAuth) {
      router.push('/');
    }
  }, [isAuth, router]);

  useEffect(() => {
    reloadUser();
  }, [reloadUser]);

  const submitData = async (prevState: ProfileState, formData: FormData): Promise<ProfileState> => {
    const data = Object.fromEntries(formData.entries());

    const response = await UserApi.updateUser(data);
    setUser(response);

    if (user.id > 0) {
      createMessage('회원 정보가 수정되었습니다.');
      return {
        nickname: response.nickname,
      };
    }

    return data as unknown as ProfileState;
  };

  const [state, submitForm, isPending] = useActionState(submitData, { nickname: user.nickname });

  return (
    <form className="flex flex-col gap-4 common-panel padding" action={submitForm}>
      <h2 className="text-xl font-bold text-slate-200">회원 정보 수정</h2>
      <I.Input label="이메일" value={user.email} disabled={true} />
      <I.Input label="닉네임" name="nickname" defaultValue={state.nickname} disabled={isPending} />

      <button
        type="submit"
        className={cn([
          'w-full h-12 transition-all duration-300',
          'rounded-lg bg-indigo-500/70 hover:bg-indigo-500/80 active:bg-indigo-500',
          'text-slate-200 font-semibold',
          isPending && 'animate-pulse cursor-not-allowed',
        ])}
        disabled={isPending}
      >
        저장
      </button>
    </form>
  );
}
