import { authInstance, defaultInstance } from '@/apis/utils/instances';
import Pagination from '@/types/api/pagination';
import type { LikeType } from '@/types/common/CommonTypes';
import type { IMyTradeData } from '@/types/cryptos/CryptoInterfaces';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import CryptoWallet from '@/types/cryptos/CryptoWallet';
import MarketCommunity from '@/types/cryptos/MarketCommunity';
import MarketCommunityComment from '@/types/cryptos/MarketCommunityComment';
import TradeHistory from '@/types/cryptos/TradeHistory';
import TradeOrder from '@/types/cryptos/TradeOrder';
import TradePosition from '@/types/cryptos/TradePosition';

namespace CryptoApi {
  // region MyTrades
  export async function getMyTrades(): Promise<IMyTradeData> {
    const result: IMyTradeData = {
      wallet: new CryptoWallet(),
      positions: [],
      orders: [],
    };

    try {
      const response = await authInstance.post('api/cryptos/my_trades/');
      const data = (await response.json()) as any;
      result.wallet.parseResponse(data.wallet);
      if (data.positions && Array.isArray(data.positions)) {
        data.positions.forEach((item: any) => {
          const tradePosition: TradePosition = new TradePosition();
          tradePosition.parseResponse(item as any);
          result.positions.push(tradePosition);
        });
      }
      if (data.orders && Array.isArray(data.orders)) {
        data.orders.forEach((item: any) => {
          const tradeOrder: TradeOrder = new TradeOrder();
          tradeOrder.parseResponse(item as any);
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
  export async function getWallet(): Promise<CryptoWallet> {
    const result: CryptoWallet = new CryptoWallet();

    try {
      const response = await authInstance.get('api/cryptos/wallet/');
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function transactionWallet(requestData: object): Promise<boolean> {
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
  export async function getMarkets(search: string, marketType: string): Promise<Array<CryptoMarket>> {
    const result: Array<CryptoMarket> = [];

    try {
      const response = await defaultInstance.get('api/cryptos/market/', {
        searchParams: {
          search: search,
          market_type: marketType,
        },
      });
      const data = (await response.json()) as any;
      if (Array.isArray(data as any)) {
        data.forEach((item: any) => {
          const market: CryptoMarket = new CryptoMarket();
          market.parseResponse(item as any);
          result.push(market);
        });
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // 가격을 제외한 심플한 데이터 전부 가져온다
  export async function getMarketAll(): Promise<Array<CryptoMarket>> {
    const result: Array<CryptoMarket> = [];

    try {
      const response = await defaultInstance.get('api/cryptos/market_all/');
      const data = (await response.json()) as any;
      if (Array.isArray(data as any)) {
        data.forEach((item: any) => {
          const market: CryptoMarket = new CryptoMarket();
          market.parseResponse(item as any);
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
  export async function orderMarket(requestData: object): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/order_market/', { json: requestData });
      const data = (await response.json()) as any;
      result = data as boolean;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function orderLimit(requestData: object): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/order_limit/', { json: requestData });
      const data = (await response.json()) as any;
      result = data as boolean;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function orderLimitCancel(orderId: number): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/order_limit_cancel/', { json: { order_id: orderId } });
      const data = (await response.json()) as any;
      result = data as boolean;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function orderLimitChase(orderId: number, price: number): Promise<boolean> {
    let result = false;

    try {
      const response = await authInstance.post('api/cryptos/order_limit_chase/', {
        json: { order_id: orderId, price },
      });
      const data = (await response.json()) as any;
      result = data as boolean;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion

  // region Trade
  export async function getTradePostions(): Promise<Array<TradePosition>> {
    const result: Array<TradePosition> = [];

    try {
      const response = await authInstance.get('api/cryptos/my_position/');
      const data = (await response.json()) as any;
      if (Array.isArray(data as any)) {
        data.forEach((item: any) => {
          const tradePosition: TradePosition = new TradePosition();
          tradePosition.parseResponse(item as any);
          result.push(tradePosition);
        });
      }
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getTradeOrders(): Promise<Array<TradeOrder>> {
    const result: Array<TradeOrder> = [];

    try {
      const response = await authInstance.get('api/cryptos/my_order/');
      const data = (await response.json()) as any;
      if (Array.isArray(data as any)) {
        data.forEach((item: any) => {
          const tradeOrder: TradeOrder = new TradeOrder();
          tradeOrder.parseResponse(item as any);
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
  export async function getTradeOrderHistories(
    pageIndex = 1,
    pageSize = 50,
    dateStart = '',
    dateEnd = '',
  ): Promise<Pagination<TradeOrder>> {
    const result = new Pagination<TradeOrder>();

    const searchParams: {
      page: string;
      page_size: string;
      date_start?: string;
      date_end?: string;
    } = {
      page: pageIndex.toString(),
      page_size: pageSize.toString(),
    };

    if (dateStart) {
      searchParams.date_start = dateStart;
    }
    if (dateEnd) {
      searchParams.date_end = dateEnd;
    }

    try {
      const response = await authInstance.get('api/cryptos/my_order_history/', { searchParams });
      const data = (await response.json()) as any;
      result.parseResponse(data as any, TradeOrder);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getTradeHistories(
    pageIndex = 1,
    pageSize = 50,
    dateStart = '',
    dateEnd = '',
  ): Promise<Pagination<TradeHistory>> {
    const result = new Pagination<TradeHistory>();

    const searchParams: {
      page: string;
      page_size: string;
      date_start?: string;
      date_end?: string;
    } = {
      page: pageIndex.toString(),
      page_size: pageSize.toString(),
    };

    if (dateStart) {
      searchParams.date_start = dateStart;
    }
    if (dateEnd) {
      searchParams.date_end = dateEnd;
    }

    try {
      const response = await authInstance.get('api/cryptos/my_trade_history/', { searchParams });
      const data = (await response.json()) as any;
      result.parseResponse(data as any, TradeHistory);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getTradePositionHistories(
    pageIndex = 1,
    pageSize = 50,
    dateStart = '',
    dateEnd = '',
  ): Promise<Pagination<TradePosition>> {
    const result = new Pagination<TradePosition>();

    const searchParams: {
      page: string;
      page_size: string;
      date_start?: string;
      date_end?: string;
    } = {
      page: pageIndex.toString(),
      page_size: pageSize.toString(),
    };

    if (dateStart) {
      searchParams.date_start = dateStart;
    }
    if (dateEnd) {
      searchParams.date_end = dateEnd;
    }

    try {
      const response = await authInstance.get('api/cryptos/my_position_history/', { searchParams });
      const data = (await response.json()) as any;
      result.parseResponse(data as any, TradePosition);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion

  // region Community
  export async function getCommunityList(
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
      const data = (await response.json()) as any;
      result.parseResponse(data as any, MarketCommunity);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function getCommunityDetail(nanoId: string): Promise<MarketCommunity> {
    const result: MarketCommunity = new MarketCommunity();

    try {
      const response = await defaultInstance.get(`api/cryptos/community/${nanoId}/`);
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function createCommunity(requestData: object): Promise<MarketCommunity> {
    const result: MarketCommunity = new MarketCommunity();

    try {
      const response = await authInstance.post('api/cryptos/community_create/', { json: requestData });
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function updateCommunity(nanoId: string, requestData: object): Promise<MarketCommunity> {
    const result: MarketCommunity = new MarketCommunity();

    try {
      const response = await authInstance.put(`api/cryptos/community_update/${nanoId}/`, { json: requestData });
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function deleteCommunity(nanoId: string): Promise<boolean> {
    let result = false;

    try {
      await authInstance.delete(`api/cryptos/community_update/${nanoId}/`);
      result = true;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function likeCommunity(nanoId: string, likeType: LikeType): Promise<boolean> {
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
  export async function getCommunityCommentList(
    communityNanoId: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<Pagination<MarketCommunityComment>> {
    const result: Pagination<MarketCommunityComment> = new Pagination<MarketCommunityComment>();

    try {
      const response = await defaultInstance.get('api/cryptos/community_comment/', {
        searchParams: {
          community_id: communityNanoId,
          page: pageIndex.toString(),
          page_size: pageSize.toString(),
        },
      });
      const data = (await response.json()) as any;
      result.parseResponse(data as any, MarketCommunityComment);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function createCommunityComment(requestData: object): Promise<MarketCommunityComment> {
    const result: MarketCommunityComment = new MarketCommunityComment();

    try {
      const response = await authInstance.post('api/cryptos/community_comment_create/', { json: requestData });
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function updateCommunityComment(id: number, requestData: object): Promise<MarketCommunityComment> {
    const result: MarketCommunityComment = new MarketCommunityComment();

    try {
      const response = await authInstance.put(`api/cryptos/community_comment_update/${id}/`, { json: requestData });
      const data = (await response.json()) as any;
      result.parseResponse(data as any);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  export async function deleteCommunityComment(id: number): Promise<boolean> {
    let result = false;

    try {
      await authInstance.delete(`api/cryptos/community_comment_update/${id}/`);
      result = true;
    } catch (error) {
      console.log(error);
    }

    return result;
  }
  // endregion
}

export default CryptoApi;
