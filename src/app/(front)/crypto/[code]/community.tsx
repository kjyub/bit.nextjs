import CryptoServerApi from '@/apis/api/cryptos/CryptoServerApi';
import CryptoMarketCommunity from '@/components/cryptos/community/CryptoMarketCommunity';
import { MARKET_COMMUNITY_PAGE_SIZE } from '@/constants/CryptoConsts';
import { IMarketPageSearchParams } from './page';

interface IMarketPage {
  params: { code: string };
  searchParams: IMarketPageSearchParams;
}
export default async function CryptoMarketCommunityPage({ params, searchParams }: IMarketPage) {
  const { code } = params;
  const { search = '', page = 1 } = searchParams;

  const communityListData = await CryptoServerApi.getCommunityList(search, code, page, MARKET_COMMUNITY_PAGE_SIZE);

  return <CryptoMarketCommunity marketCode={code} params={params} communityListData={communityListData} />;
}
