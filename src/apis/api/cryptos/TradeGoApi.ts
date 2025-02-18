import { UserTypes } from '@/types/users/UserTypes';
import ApiUtils from '@/utils/ApiUtils';
import Pagination from '@/types/api/pagination';
import { EditStateTypes } from '@/types/DataTypes';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import { io, Socket } from "socket.io-client"
import { tradeDefaultInstance } from '@/apis/utils/clientTradeApis';
import useToastMessageStore from '@/store/useToastMessageStore';

class TradeGoApi {
    // region Market
    static async getMarketsCurrent(marketCodes: Array<string> = []): Promise<Array<IUpbitMarketTicker>> {
        let result: Array<IUpbitMarketTicker> = []

        await tradeDefaultInstance.post("/markets", {
            markets: marketCodes
        }).then(({ data }) => {
            if (Array.isArray(data)) {
                result = data
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getMarketsCurrentDic(marketCodes: Array<string> = []): Promise<{ [key: string]: IUpbitMarketTicker }> {
        const markets = await this.getMarketsCurrent(marketCodes)

        const result: { [key: string]: IUpbitMarketTicker } = {}
        markets.forEach((market: IUpbitMarketTicker) => {
            result[market.code] = market
        })

        return result
    }
    static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
        let result: IUpbitMarketTicker = {}

        await tradeDefaultInstance.post("/markets", {
            markets: [marketCode]
        }).then(({ data }) => {
            if (Array.isArray(data) && data.length > 0) {
                result = data[0]
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    // endregion

    static initPriceWebSocket(sendMessage: string | null): WebSocket {
        // const socket = new WebSocket('wss://api.upbit.com/websocket/v1')
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_TRADE_SOCKET_SERVER}/market`)
        socket.binaryType = "arraybuffer"
        const updateMarketPriceDic = useMarketPriceStore.getState().updateMarketPriceDic
      
        socket.onopen = () => {
            console.log('WebSocket connected')

            if (sendMessage) {
                socket.send(sendMessage)
            }
        }
      
        socket.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data as string)
                updateMarketPriceDic(data as object)
            } catch (error) {
                console.log('Failed to parse WebSocket message', error)
            }
        }
      
        socket.onerror = (event) => {
            console.log('WebSocket error', event)
        }
      
        socket.onclose = () => {
            console.log('WebSocket disconnected')
        }
      
        return socket
    }

    static initUserAlarmWebSocket(userUUID: string, updateInfo: () => void): WebSocket {
        const addToastMessage = useToastMessageStore.getState().addMessage

        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_USER_ALARM_SOCKET_SERVER}/user?user_id=${userUUID}`)
        socket.binaryType = "arraybuffer"
      
        socket.onopen = () => {
            console.log('WebSocket connected')
        }
      
        socket.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data as string)
                addToastMessage(String(data.content))
                updateInfo()
            } catch (error) {
                console.log('Failed to parse WebSocket message', error)
            }
        }
      
        socket.onerror = (event) => {
            console.log('WebSocket error', event)
        }
      
        socket.onclose = () => {
            console.log('WebSocket disconnected')
        }
      
        return socket
    }
}

export default TradeGoApi