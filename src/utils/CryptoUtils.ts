import { PriceChangeTypes } from "@/types/cryptos/CryptoTypes"
import CommonUtils from "./CommonUtils"
import { TextFormats } from "@/types/CommonTypes"


export default class CryptoUtils{
    // 유저 타입에따라 쓰기가 가능한 현황만 가져온다.
    static getPriceChangeType(price: number, openingPrice: number): PriceChangeTypes {
        let changeType = PriceChangeTypes.EVEN

        if (price > openingPrice) {
            changeType = PriceChangeTypes.RISE
        } else if (price < openingPrice) {
            changeType = PriceChangeTypes.FALL
        }

        return changeType
    }
    // 가격 텍스트 넓이를 계산하기 위해 가격 별 최대 몇글자 인지 구한다.
    static getPriceTextLength(price: number): number {
        if (price >= 1000) {
            return price.toString().length
        } else if (price >= 1) {
            return 4
        } else if (price == 0) {
            return 1
        } else {
            const decimalPlaces = Math.abs(Math.floor(Math.log10(price)))
            return decimalPlaces + 4
        }
    }
    static getPriceText(price: number): string {
        return CommonUtils.textFormat(price, TextFormats.NUMBER)
    }
    static getTradePriceText(price: number): string {
        if (price >= 1000000) {

            return CommonUtils.textFormat((price / 1000000).toFixed(0), TextFormats.NUMBER) + "백만"
        } else if (price >= 10000) {
            return CommonUtils.textFormat((price / 10000).toFixed(0), TextFormats.NUMBER) + "만"
        } else {
            return price.toString()
        }
    }
}
