import SignupLobby from '@/components/signup/SignupLobby';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
};

export default function SignupPage() {
  return <SignupLobby />;
}
