import { map, pipe, sort, toArray, uniqBy } from '@fxts/core';
import type { AreaData, CandlestickData, HistogramData, UTCTimestamp } from 'lightweight-charts';
import type { IUpbitCandle } from '../../../types/cryptos/CryptoInterfaces';
import { type CandleTimeType, CandleTimes } from './Types';

export const UP_COLOR = '#c43a3a';
export const DOWN_COLOR = '#3b69cb';

const UP_COLOR_RGBA = `${UP_COLOR}cc`;
const DOWN_COLOR_RGBA = `${DOWN_COLOR}cc`;

export const getTimeFormatter = (timeType: CandleTimeType) => {
  if (timeType === CandleTimes.SECOND) {
    return (time: number) => {
      const date = new Date(time);
      return date.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };
  } else if (
    timeType === CandleTimes.MINUTE1 ||
    timeType === CandleTimes.MINUTE3 ||
    timeType === CandleTimes.MINUTE5 ||
    timeType === CandleTimes.MINUTE10
  ) {
    return (time: number) => {
      const date = new Date(time);
      return date.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
  } else if (timeType === CandleTimes.MINUTE15) {
    return (time: number) => {
      const date = new Date(time);
      // 15분으로 내림 처리
      const minutes = Math.floor(date.getMinutes() / 15) * 15;
      date.setMinutes(minutes);
      return date.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
  } else if (timeType === CandleTimes.MINUTE60) {
    return (time: number) => {
      const date = new Date(time);
      // 1시간으로 내림 처리
      const hours = Math.floor(date.getHours() / 1) * 1;
      date.setHours(hours);
      date.setMinutes(0);
      return date.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
  } else if (timeType === CandleTimes.MINUTE240) {
    return (time: number) => {
      const date = new Date(time);
      // 4시간으로 내림 처리 (UTC 기준)
      const utcHours = date.getUTCHours();
      const roundedUTCHours = Math.floor(utcHours / 4) * 4;
      date.setUTCHours(roundedUTCHours, 0, 0, 0);
      return date.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
  } else if (timeType === CandleTimes.DAY) {
    return (time: number) => {
      const date = new Date(time);
      // 일자로 내림 처리
      const day = Math.floor(date.getDate() / 1) * 1;
      date.setDate(day);
      return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
  } else if (timeType === CandleTimes.WEEK) {
    return (time: number) => {
      const date = new Date(time);
      // 일자로 내림 처리
      const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      const day = Math.floor(utcDate.getDate() / 7) * 7;
      utcDate.setDate(day);
      return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
  } else if (timeType === CandleTimes.MONTH) {
    return (time: number) => {
      const date = new Date(time);
      // 월로 내림 처리
      const month = Math.floor(date.getMonth() / 1) * 1;
      date.setMonth(month);
      return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit' });
    };
  } else {
    return (time: number) => {
      const date = new Date(time);
      return date.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };
  }
};

export const parseAreaData = (candles: IUpbitCandle[]): AreaData[] => {
  return pipe(
    candles,
    uniqBy((c) => c.timestamp),
    map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.trade_price,
    })),
    sort((a, b) => a.time - b.time),
    toArray,
  ) as AreaData[];
};

// timestamp asc 정렬 후 실행
const parseDataWithColor = (transform: (candle: IUpbitCandle, color: string) => HistogramData | CandlestickData) => {
  return function* (iter: Iterable<IUpbitCandle>) {
    const candles = toArray(iter);
    let lastColor = DOWN_COLOR_RGBA;

    for (let i = 0; i < candles.length; i++) {
      const current = candles[i];
      const prev = candles[i - 1];
      let color = DOWN_COLOR_RGBA;

      if (current.trade_price > current.opening_price) {
        color = UP_COLOR_RGBA;
      } else if (current.trade_price < current.opening_price) {
        color = DOWN_COLOR_RGBA;
      } else {
        // 보합일 때 이전 종가 기준
        if (prev) {
          if (current.trade_price > prev.trade_price) {
            color = UP_COLOR_RGBA;
          } else if (current.trade_price < prev.trade_price) {
            color = DOWN_COLOR_RGBA;
          } else {
            color = lastColor;
          }
        } else {
          color = lastColor;
        }
      }

      lastColor = color;
      yield transform(current, color);
    }
  };
};

export const parseCandleData = (candles: IUpbitCandle[]): CandlestickData[] => {
  return pipe(
    candles,
    uniqBy((c) => c.timestamp),
    sort((a, b) => Number(a.timestamp) - Number(b.timestamp)),
    parseDataWithColor((c, color) => ({
      time: c.timestamp as UTCTimestamp,
      open: c.opening_price,
      high: c.high_price,
      low: c.low_price,
      close: c.trade_price,
      color,
    })),
    toArray,
  ) as CandlestickData[];
};

export const parseVolumeData = (candles: IUpbitCandle[]): HistogramData[] => {
  return pipe(
    candles,
    uniqBy((c) => c.timestamp),
    sort((a, b) => Number(a.timestamp) - Number(b.timestamp)),
    parseDataWithColor((c, color) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.candle_acc_trade_volume,
      color,
    })),
    toArray,
  ) as HistogramData[];
};
