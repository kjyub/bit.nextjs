import CryptoMarketCommunity from '@/components/cryptos/community/Community';
import * as S from '@/styles/CryptoMarketStyles';
import CryptoMarketCommunityPage from '../community';

export default async function Loading() {
  console.log('loading');
  return (
    <div className="max-md:w-full md:w-156 p-4">
      <S.TitleLayout>
        <div className="flex flex-col gap-1">
          {/* 코인 이름 */}
          <S.MainTitleBox>
            <div className="p-1 bg-slate-500/50 rounded-lg animate-pulse">
              <div className="max-md:w-6 md:w-7 aspect-square"></div>
            </div>
            <h1 className="max-md:text-xl md:text-3xl text-slate-50 font-semibold skeleton w-32">이름</h1>
          </S.MainTitleBox>

          {/* 코인 가격 */}
          <S.MainPriceBox>
            <div className="change skeleton w-84">변동률</div>
          </S.MainPriceBox>
        </div>
      </S.TitleLayout>

      <CryptoMarketCommunity
        marketCode={'KRW-BTC'}
        searchParams={{ search: '', page: 1 }}
        communityListData={{}}
        isLoading={true}
      />
    </div>
  );
}
