import UserDelete from '@/components/mypages/Delete';
import Profile from '@/components/mypages/Profile';
import * as MS from '@/styles/MainStyles';

export async function generateMetadata() {
  return {
    title: '마이페이지',
  };
}

export default function MyPage() {
  return (
    <MS.PageLayout>
      <div className="flex flex-col max-sm:w-full max-sm:max-w-96 sm:w-96 mx-auto max-sm:px-4 max-md:pt-4 md:pt-8 gap-4">
        <Profile />
        <UserDelete />
      </div>
    </MS.PageLayout>
  )
}