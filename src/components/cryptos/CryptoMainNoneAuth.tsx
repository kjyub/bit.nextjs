import * as S from '@/styles/CryptoWalletStyles';
import Link from 'next/link';
import CommonButton from '../atomics/buttons/CommonButton';

export default function CryptoMainNoneAuth() {
  return (
    <div className="flex flex-col flex-center h-[calc(100dvh-4rem)] full:p-36">
      <S.WalletLayout>
        <h1 className="my-4 text-xl font-bold">로그인 후 이용해주세요</h1>
        <Link href="/auth" className="flex flex-col w-full">
          <CommonButton className="py-2">로그인</CommonButton>
        </Link>
      </S.WalletLayout>
    </div>
  );
}
