'use client';

import UserApi from '@/apis/api/users/UserApi';
import { useUser } from '@/hooks/useUser';
import useSystemMessageStore from '@/store/useSystemMessageStore';
import useToastMessageStore from '@/store/useToastMessageStore';
import { cn } from '@/utils/StyleUtils';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';

export default function UserDelete() {
  const { signOut } = useUser();
  const createToastMessage = useToastMessageStore((state) => state.createMessage);
  const createSystemMessage = useSystemMessageStore((state) => state.createMessage);
  const router = useRouter();

  const submitData = async (prevState: null, formData: FormData): Promise<null> => {
    const isConfirmed = await createSystemMessage({
      type: 'confirm',
      content: '정말 탈퇴하시겠습니까?',
    });

    if (!isConfirmed) {
      return null;
    }

    const response = await UserApi.deleteUser();

    if (response) {
      createToastMessage('회원 탈퇴가 완료되었습니다.');
      signOut();
      router.push('/');
    } else {
      createToastMessage('회원 탈퇴에 실패했습니다.');
    }

    return null;
  }

  const [state, submitForm, isPending] = useActionState(submitData, null);

  return (
    <form className="flex flex-col gap-4 common-panel padding" action={submitForm}>
      <h2 className="text-xl font-bold text-slate-200">회원 탈퇴</h2>

      <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
        <li>꾸리토 회원 탈퇴 시, 로그인 정보는 즉시 삭제되며 복구가 불가능합니다.</li>
        <li>탈퇴와 함께 모의투자 기록 및 커뮤니티 활동 이력도 삭제됩니다.</li>
        <li>서비스 이용 중 약관을 위반한 경우, 별도의 사전 통보 없이 이용 제한 또는 탈퇴 조치가 될 수 있습니다.</li>
        <li>서비스는 운영자 판단에 따라 기능이 변경되거나 종료될 수 있으며, 게시글 등 커뮤니티 콘텐츠의 책임은 작성자에게 있습니다.</li>
      </ul>

      <button 
        type="submit"
        className={cn([
          'px-8 h-10 transition-all duration-300',
          'rounded-lg bg-slate-500/30 hover:bg-slate-500/40',
          'border border-slate-500/40',
          'text-slate-200 font-semibold',
          isPending && 'animate-pulse cursor-not-allowed'
        ])}
        disabled={isPending}
      >
        회원 탈퇴
      </button>
    </form>
  )
}