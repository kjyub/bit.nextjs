import * as S from '@/styles/CryptoWalletStyles';
import Link from 'next/link';
import CommonButton from '../atomics/buttons/CommonButton';

export default function CryptoMainNoneAuth() {
  return (
    <div className="flex flex-col flex-center h-[calc(100dvh-4rem)]">
      <S.WalletLayout>
        <h1 className="my-4 text-xl font-bold">로그인 후 이용해주세요</h1>
        <CommonButton className="py-2">
          <Link href="/auth">로그인</Link>
        </CommonButton>
      </S.WalletLayout>
    </div>
  );
}
