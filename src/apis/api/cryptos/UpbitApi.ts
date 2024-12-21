import { UserTypes } from '@/types/users/UserTypes';
import { authInstance, defaultInstance, fileInstance } from '../../utils/clientApis';
import ApiUtils from '@/utils/ApiUtils';
import Pagination from '@/types/api/pagination';
import { EditStateTypes } from '@/types/DataTypes';
import CryptoMarket from '@/types/cryptos/CryptoMarket';
import useMarketPriceStore from '@/store/useMarketPriceStore';
import { io, Socket } from "socket.io-client"

class UpbitApi {
    // region Market
    static async getMarketsAll(): Promise<Array<IUpbitMarket>> {
        let result: Array<IUpbitMarket> = []

        await defaultInstance.get("https://api.upbit.com/v1/market/all").then(({ data }) => {
            if (Array.isArray(data)) {
                result = data
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getMarketsCurrent(marketCodes: Array<string>): Promise<Array<IUpbitMarketTicker>> {
        let result: Array<IUpbitMarketTicker> = []

        await defaultInstance.get("https://api.upbit.com/v1/ticker", { params: {
            markets: marketCodes.join(",")
        }}).then(({ data }) => {
            if (Array.isArray(data)) {
                result = data
            }
        }).catch((error) => {
            console.log(error)
        })

        return result
    }
    static async getMarketCurrent(marketCode: string): Promise<IUpbitMarketTicker> {
        let result: IUpbitMarketTicker = {}

        await defaultInstance.get("https://api.upbit.com/v1/ticker", { params: {
            markets: marketCode
        }}).then(({ data }) => {
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
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_TRADE_SOCKET_SERVER}/ws`)
        socket.binaryType = "arraybuffer"
        const updateMarketPriceDic = useMarketPriceStore.getState().updateMarketPriceDic
      
        socket.onopen = () => {
            console.log('WebSocket connected')

            if (sendMessage) {
                socket.send(sendMessage)
                console.log(sendMessage)
            }
        }
      
        socket.onmessage = (event: MessageEvent) => {
            console.log(event.data)
            try {
                const data = JSON.parse(event.data)
                updateMarketPriceDic(data)
            } catch (error) {
                console.error('Failed to parse WebSocket message', error)
            }
        }
      
        socket.onerror = (event) => {
            console.error('WebSocket error', event)
        }
      
        socket.onclose = () => {
            console.log('WebSocket disconnected')
        }
      
        return socket
    }
}

export default UpbitApi