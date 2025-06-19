import SignupInfo from '@/components/signup/SignupInfo';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '회원가입',
};

export default function SignupPage() {
  return (
    <>
      <title>회원가입</title>
      <SignupInfo />
    </>
  );
}
