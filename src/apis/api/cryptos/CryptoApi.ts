import Pagination from '@/types/api/pagination';
import { IMyTradeData } from '@/types/cryptos/CryptoInterfaces';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import CryptoWallet from '@/types/cryptos/CryptoWallet';
import MarketCommunity from '@/types/cryptos/MarketCommunity';
import MarketCommunityComment from '@/types/cryptos/MarketCommunityComment';
import TradeHistory from '@/types/cryptos/TradeHistory';
import TradeOrder from '@/types/cryptos/TradeOrder';
import TradePosition from '@/types/cryptos/TradePosition';
import { authInstance, defaultInstance } from '@/apis/utils/instances';

class CryptoApi {
  // region MyTrades
  static async getMyTrades(): Promise<IMyTradeData> {
    const result: IMyTradeData = {
      wallet: new CryptoWallet(),
      positions: [],
      orders: [],
    };

    try {
      const response = await authInstance.post('api/cryptos/my_trades/');
      const data = await response.json();
      result.wallet.parseResponse(data.wallet as object);
      if (data.positions && Array.isArray(data.positions)) {
        (data.positions as any[]).forEach((item) => {
          const tradePosition: TradePosition = new TradePosition();
          tradePosition.parseResponse(item as object);
          result.positions.push(tradePosition);
        });
      }
      if (data.orders && Array.isArray(data.orders)) {
        (data.orders as any[]).forEach((item) => {
          const tradeOrder: TradeOrder = new TradeOrder();
          tradeOrder.parseResponse(item as object);
          result.orders.push(tradeOrder);
        });
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion
  // region Wallet
  static async getWallet(): Promise<CryptoWallet> {
    const result: CryptoWallet = new CryptoWallet();

    try {
      const response = await authInstance.get('api/cryptos/wallet/');
      const data = await response.json();
      result.parseResponse(data as object);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async transactionWallet(requestData: object): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/wallet_transaction/', { json: requestData });
      result = response.ok;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion
  // region Market
  static async getMarkets(search: string, marketType: string): Promise<Array<CryptoMarket>> {
    const result: Array<CryptoMarket> = [];

    try {
      const response = await defaultInstance.get('api/cryptos/market/', {
        searchParams: {
          search: search,
          market_type: marketType,
        },
      });
      const data = await response.json();
      if (Array.isArray(data as object)) {
        (data as any[]).forEach((item) => {
          const market: CryptoMarket = new CryptoMarket();
          market.parseResponse(item as object);
          result.push(market);
        });
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // 가격을 제외한 심플한 데이터 전부 가져온다
  static async getMarketAll(): Promise<Array<CryptoMarket>> {
    const result: Array<CryptoMarket> = [];

    try {
      const response = await defaultInstance.get('api/cryptos/market_all/');
      const data = await response.json();
      if (Array.isArray(data as object)) {
        (data as any[]).forEach((item) => {
          const market: CryptoMarket = new CryptoMarket();
          market.parseResponse(item as object);
          result.push(market);
        });
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion

  // region Order
  static async orderMarket(requestData: object): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/order_market/', { json: requestData });
      const data = await response.json();
      result = data as boolean;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async orderLimit(requestData: object): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/order_limit/', { json: requestData });
      const data = await response.json();
      result = data as boolean;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async orderLimitCancel(orderId: number): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/order_limit_cancel/', { json: { order_id: orderId } });
      const data = await response.json();
      result = data as boolean;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async orderLimitChase(orderId: number, price: number): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/order_limit_chase/', {
        json: { order_id: orderId, price },
      });
      const data = await response.json();
      result = data as boolean;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion

  // region Trade
  static async getTradePostions(): Promise<Array<TradePosition>> {
    const result: Array<TradePosition> = [];

    try {
      const response = await authInstance.get('api/cryptos/my_position/');
      const data = await response.json();
      if (Array.isArray(data as object)) {
        (data as any[]).forEach((item) => {
          const tradePosition: TradePosition = new TradePosition();
          tradePosition.parseResponse(item as object);
          result.push(tradePosition);
        });
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getTradeOrders(): Promise<Array<TradeOrder>> {
    const result: Array<TradeOrder> = [];

    try {
      const response = await authInstance.get('api/cryptos/my_order/');
      const data = await response.json();
      if (Array.isArray(data as object)) {
        (data as any[]).forEach((item) => {
          const tradeOrder: TradeOrder = new TradeOrder();
          tradeOrder.parseResponse(item as object);
          result.push(tradeOrder);
        });
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion

  // region History
  static async getTradeOrderHistories(
    pageIndex: number = 1,
    pageSize: number = 50,
    dateStart: string = '',
    dateEnd: string = '',
  ): Promise<Pagination<TradeOrder>> {
    const result = new Pagination<TradeOrder>();

    const searchParams = {
      page: pageIndex.toString(),
      page_size: pageSize.toString(),
    };

    if (dateStart) {
      searchParams['date_start'] = dateStart;
    }
    if (dateEnd) {
      searchParams['date_end'] = dateEnd;
    }

    try {
      const response = await authInstance.get('api/cryptos/my_order_history/', { searchParams });
      const data = await response.json();
      result.parseResponse(data as object, TradeOrder);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getTradeHistories(
    pageIndex: number = 1,
    pageSize: number = 50,
    dateStart: string = '',
    dateEnd: string = '',
  ): Promise<Pagination<TradeHistory>> {
    const result = new Pagination<TradeHistory>();

    const searchParams = {
      page: pageIndex.toString(),
      page_size: pageSize.toString(),
    };

    if (dateStart) {
      searchParams['date_start'] = dateStart;
    }
    if (dateEnd) {
      searchParams['date_end'] = dateEnd;
    }

    try {
      const response = await authInstance.get('api/cryptos/my_trade_history/', { searchParams });
      const data = await response.json();
      result.parseResponse(data as object, TradeHistory);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getTradePositionHistories(
    pageIndex: number = 1,
    pageSize: number = 50,
    dateStart: string = '',
    dateEnd: string = '',
  ): Promise<Pagination<TradePosition>> {
    const result = new Pagination<TradePosition>();

    const searchParams = {
      page: pageIndex.toString(),
      page_size: pageSize.toString(),
    };

    if (dateStart) {
      searchParams['date_start'] = dateStart;
    }
    if (dateEnd) {
      searchParams['date_end'] = dateEnd;
    }

    try {
      const response = await authInstance.get('api/cryptos/my_position_history/', { searchParams });
      const data = await response.json();
      result.parseResponse(data as object, TradePosition);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion

  // region Community
  static async getCommunityList(
    search: string,
    marketCode: string,
    page: number,
    pageSize: number,
  ): Promise<Pagination<MarketCommunity>> {
    const result: Pagination<MarketCommunity> = new Pagination<MarketCommunity>();

    try {
      const response = await defaultInstance.get('api/cryptos/community/', {
        searchParams: {
          search: search,
          market_code: marketCode,
          page: page.toString(),
          page_size: pageSize.toString(),
        },
      });
      const data = await response.json();
      result.parseResponse(data as object, MarketCommunity);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async getCommunityDetail(nanoId: string): Promise<MarketCommunity> {
    const result: MarketCommunity = new MarketCommunity();

    try {
      const response = await authInstance.get(`api/cryptos/community/${nanoId}/`);
      const data = await response.json();
      result.parseResponse(data as object);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async createCommunity(requestData: object): Promise<MarketCommunity> {
    const result: MarketCommunity = new MarketCommunity();

    try {
      const response = await authInstance.post('api/cryptos/community_create/', { json: requestData });
      const data = await response.json();
      result.parseResponse(data as object);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async updateCommunity(nanoId: string, requestData: object): Promise<MarketCommunity> {
    const result: MarketCommunity = new MarketCommunity();

    try {
      const response = await authInstance.put(`api/cryptos/community_update/${nanoId}/`, { json: requestData });
      const data = await response.json();
      result.parseResponse(data as object);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async deleteCommunity(nanoId: string): Promise<boolean> {
    let result = false;

    try {
      await authInstance.delete(`/api/cryptos/community_update/${nanoId}/`);
      result = true;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async likeCommunity(nanoId: string, likeType: LikeTypeValues): Promise<boolean> {
    let result = false;

    try {
      await authInstance.post(`api/cryptos/community_like/${nanoId}/`, { json: { like_type: likeType } });
      result = true;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion
  // region Community Comment
  static async getCommunityCommentList(
    communityNanoId: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<Pagination<MarketCommunityComment>> {
    const result: Pagination<MarketCommunityComment> = new Pagination<MarketCommunityComment>();

    try {
      const response = await defaultInstance.get(`api/cryptos/community_comment/`, {
        searchParams: {
          community_id: communityNanoId,
          page: pageIndex.toString(),
          page_size: pageSize.toString(),
        },
      });
      const data = await response.json();
      result.parseResponse(data as object, MarketCommunityComment);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async createCommunityComment(requestData: object): Promise<MarketCommunityComment> {
    const result: MarketCommunityComment = new MarketCommunityComment();

    try {
      const response = await authInstance.post('api/cryptos/community_comment_create/', { json: requestData });
      const data = await response.json();
      result.parseResponse(data as object);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async updateCommunityComment(id: number, requestData: object): Promise<MarketCommunityComment> {
    const result: MarketCommunityComment = new MarketCommunityComment();

    try {
      const response = await authInstance.put(`api/cryptos/community_comment_update/${id}/`, { json: requestData });
      const data = await response.json();
      result.parseResponse(data as object);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  static async deleteCommunityComment(id: number): Promise<boolean> {
    let result = false;

    try {
      await authInstance.delete(`/api/cryptos/community_comment_update/${id}/`);
      result = true;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion
}

export default CryptoApi;
