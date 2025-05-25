import { defaultInstance } from "@/apis/utils/api";

class CryptoServerApi {
  // region Market
  static async getMarkets(search: string, marketType: string): Promise<object> {
    let result: object = {};

    await defaultInstance
      .get("/api/cryptos/market/", {
        params: {
          search: search,
          market_type: marketType,
        },
      })
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  // 가격을 제외한 심플한 데이터 전부 가져온다
  static async getMarketAll(): Promise<object> {
    let result: object = {};

    await defaultInstance
      .get("/api/cryptos/market_all/")
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  static async getMarket(code: string): Promise<object> {
    let result: object = {};

    await defaultInstance
      .get(`/api/cryptos/market/${code}/`)
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  // endregion

  // region Community
  static async getCommunityList(search: string, marketCode: string, page: number, pageSize: number): Promise<object> {
    let result: object = {};

    await defaultInstance
      .get("/api/cryptos/community/", {
        params: {
          search: search,
          market_code: marketCode,
          page: page,
          page_size: pageSize,
        },
      })
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  static async getCommunityDetail(nanoId: string): Promise<object> {
    let result: object = {};

    await defaultInstance
      .get(`/api/cryptos/community/${nanoId}/`)
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  // endregion
  // region Community Comment
  static async getCommunityCommentList(communityId: number, pageIndex: number, pageSize: number): Promise<object> {
    let result: object = {};

    await defaultInstance
      .get("/api/cryptos/community_comment/", {
        params: {
          community_id: communityId,
          page: pageIndex,
          page_size: pageSize,
        },
      })
      .then(({ data }) => {
        result = data;
      })
      .catch((error) => {
        console.log(error);
      });

    return result;
  }
  // endregion
}

export default CryptoServerApi;
