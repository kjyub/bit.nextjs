import { TextFormats } from '@/types/CommonTypes';
import { type PositionType, PositionTypes, type PriceChangeType, PriceChangeTypes } from '@/types/cryptos/CryptoTypes';
import CommonUtils from './CommonUtils';
import TypeUtils from './TypeUtils';

namespace CryptoUtils {
  // 유저 타입에따라 쓰기가 가능한 현황만 가져온다.
  export function getPriceChangeType(price: number, openingPrice: number): PriceChangeType {
    let changeType: PriceChangeType = PriceChangeTypes.EVEN;

    if (price > openingPrice) {
      changeType = PriceChangeTypes.RISE;
    } else if (price < openingPrice) {
      changeType = PriceChangeTypes.FALL;
    }

    return changeType;
  }
  // 가격 텍스트 넓이를 계산하기 위해 가격 별 최대 몇글자 인지 구한다.
  export function getPriceTextLength(price: number): number {
    if (price >= 1000) {
      return price.toString().length;
    } else if (price >= 1) {
      return 4;
    } else if (price === 0) {
      return 1;
    } else {
      const decimalPlaces = Math.abs(Math.floor(Math.log10(price)));
      return decimalPlaces + 4;
    }
  }
  export function getPriceRound(price: number, round = 0): number {
    if (price >= 1000) return TypeUtils.round(price, 0);
    else if (price >= 100) return TypeUtils.round(price, 1);
    else if (price >= 10) return TypeUtils.round(price, 2);
    else if (price >= 1) return TypeUtils.round(price, 3);
    else if (price > 0) return TypeUtils.round(price, round ? round : 8);
    else if (price === 0) return 0;
    else return price;
  }
  export function getPriceText(price: number): string {
    return CommonUtils.textFormat(CryptoUtils.getPriceRound(price), TextFormats.NUMBER);
  }
  export function getTradePriceText(price: number): string {
    if (price >= 1000000) {
      return `${CommonUtils.textFormat((price / 1000000).toFixed(0), TextFormats.NUMBER)}백만`;
    } else if (price >= 10000) {
      return `${CommonUtils.textFormat((price / 10000).toFixed(0), TextFormats.NUMBER)}만`;
    } else {
      return price.toString();
    }
  }
  export function getPriceUnit(price: number, round = 0): number {
    let result = '';

    if (price >= 100000) result = `${Math.round(price / 1000) * 1000}`;
    else if (price >= 10000) result = `${Math.round(price / 100) * 100}`;
    else if (price >= 1000) result = `${TypeUtils.round(price, 0)}`;
    else if (price >= 100) result = `${TypeUtils.round(price, 1)}`;
    else if (price >= 1) result = `${TypeUtils.round(price, 3)}`;
    else if (price >= 0) result = `${TypeUtils.round(price, round ? round : 8)}`;
    else result = `${TypeUtils.round(price, 4)}`;

    return Number(result);
  }
  export function getPnl(
    currentPrice: number,
    quantity: number,
    entryPrice: number,
    positionType: PositionType,
  ): number {
    if (positionType === PositionTypes.LONG) {
      return (currentPrice - entryPrice) * quantity;
    } else {
      return (entryPrice - currentPrice) * quantity;
    }
  }
}

export default CryptoUtils;
