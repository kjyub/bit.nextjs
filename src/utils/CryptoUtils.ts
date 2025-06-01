import { TextFormats } from '@/types/CommonTypes';
import { PositionType, PriceChangeTypeValues, PriceChangeTypes } from '@/types/cryptos/CryptoTypes';
import CommonUtils from './CommonUtils';
import TypeUtils from './TypeUtils';

export default class CryptoUtils {
  // 유저 타입에따라 쓰기가 가능한 현황만 가져온다.
  static getPriceChangeType(price: number, openingPrice: number): PriceChangeTypeValues {
    let changeType = PriceChangeTypes.EVEN;

    if (price > openingPrice) {
      changeType = PriceChangeTypes.RISE;
    } else if (price < openingPrice) {
      changeType = PriceChangeTypes.FALL;
    }

    return changeType;
  }
  // 가격 텍스트 넓이를 계산하기 위해 가격 별 최대 몇글자 인지 구한다.
  static getPriceTextLength(price: number): number {
    if (price >= 1000) {
      return price.toString().length;
    } else if (price >= 1) {
      return 4;
    } else if (price == 0) {
      return 1;
    } else {
      const decimalPlaces = Math.abs(Math.floor(Math.log10(price)));
      return decimalPlaces + 4;
    }
  }
  static getPriceRound(price: number): number {
    if (price >= 1000) {
      return TypeUtils.round(price, 0);
    } else if (price >= 100) {
      return TypeUtils.round(price, 1);
    } else if (price >= 10) {
      return TypeUtils.round(price, 2);
    } else if (price >= 1) {
      return TypeUtils.round(price, 3);
    } else if (price > 0) {
      return TypeUtils.round(price, 4);
    } else if (price === 0) {
      return 0;
    }

    return price;
  }
  static getPriceText(price: number): string {
    return CommonUtils.textFormat(this.getPriceRound(price), TextFormats.NUMBER);
  }
  static getTradePriceText(price: number): string {
    if (price >= 1000000) {
      return CommonUtils.textFormat((price / 1000000).toFixed(0), TextFormats.NUMBER) + '백만';
    } else if (price >= 10000) {
      return CommonUtils.textFormat((price / 10000).toFixed(0), TextFormats.NUMBER) + '만';
    } else {
      return price.toString();
    }
  }

  static getPnl(currentPrice: number, quantity: number, entryPrice: number, positionType: PositionType): number {
    if (positionType === PositionType.LONG) {
      return (currentPrice - entryPrice) * quantity;
    } else {
      return (entryPrice - currentPrice) * quantity;
    }
  }
}
