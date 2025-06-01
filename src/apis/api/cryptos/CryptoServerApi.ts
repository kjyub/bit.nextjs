import { defaultInstance } from '@/apis/utils/instances';

class CryptoServerApi {
  // region Market
  static async getMarkets(search: string, marketType: string): Promise<object> {
    let result: object = {};
    try {
      const response = await defaultInstance.get('api/cryptos/market/', {
        searchParams: {
          search: search,
          market_type: marketType,
        },
      });
      result = await response.json();
    } catch (error) {
      console.log(error);
    }
    return result;
  }
  // 가격을 제외한 심플한 데이터 전부 가져온다
  static async getMarketAll(): Promise<object> {
    let result: object = {};
    try {
      const response = await defaultInstance.get('api/cryptos/market_all/');
      result = await response.json();
    } catch (error) {
      console.log(error);
    }
    return result;
  }
  static async getMarket(code: string): Promise<object> {
    let result: object = {};
    try {
      const response = await defaultInstance.get(`api/cryptos/market/${code}/`);
      result = await response.json();
    } catch (error) {
      console.log(error);
    }
    return result;
  }
  // endregion

  // region Community
  static async getCommunityList(search: string, marketCode: string, page: number, pageSize: number): Promise<object> {
    let result: object = {};
    try {
      const response = await defaultInstance.get('api/cryptos/community/', {
        searchParams: {
          search: search,
          market_code: marketCode,
          page: page.toString(),
          page_size: pageSize.toString(),
        },
      });
      result = await response.json();
    } catch (error) {
      console.log(error);
    }
    return result;
  }
  static async getCommunityDetail(nanoId: string): Promise<object> {
    let result: object = {};
    try {
      const response = await defaultInstance.get(`api/cryptos/community/${nanoId}/`);
      result = await response.json();
    } catch (error) {
      console.log(error);
    }
    return result;
  }
  // endregion
  // region Community Comment
  static async getCommunityCommentList(communityId: number, pageIndex: number, pageSize: number): Promise<object> {
    let result: object = {};
    try {
      const response = await defaultInstance.get('api/cryptos/community_comment/', {
        searchParams: {
          community_id: communityId.toString(),
          page: pageIndex.toString(),
          page_size: pageSize.toString(),
        },
      });
      result = await response.json();
    } catch (error) {
      console.log(error);
    }
    return result;
  }
  // endregion
}

export default CryptoServerApi;
