import MineApi from '@/apis/api/mines/MineApi';
import MineMain from '@/components/mines/MineMain';
import * as MS from '@/styles/MainStyles';

export default function MinePage() {
  return (
    <MS.PageLayout>
      <div className="flex flex-col max-sm:w-full max-sm:max-w-156 sm:w-156 mx-auto max-sm:px-4 max-md:pt-4 md:pt-8 gap-4">
        <MineMain />
      </div>
    </MS.PageLayout>
  )
}