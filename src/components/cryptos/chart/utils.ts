import { map, pipe, reverse, toArray, uniqBy } from '@fxts/core';
import type { AreaData, CandlestickData, HistogramData, UTCTimestamp } from 'lightweight-charts';
import type { IUpbitCandle } from '../../../types/cryptos/CryptoInterfaces';
import { type CandleTimeType, CandleTimes } from './Types';

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
    timeType === CandleTimes.MINUTE10 ||
    timeType === CandleTimes.MINUTE15
  ) {
    return (time: number) => {
      const date = new Date(time);
      return date.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
  } else if (timeType === CandleTimes.DAY) {
    return (time: number) => {
      const date = new Date(time);
      return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
  } else if (timeType === CandleTimes.WEEK) {
    return (time: number) => {
      const date = new Date(time);
      return date.toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };
  } else if (timeType === CandleTimes.MONTH) {
    return (time: number) => {
      const date = new Date(time);
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
    reverse,
    toArray,
  ) as AreaData[];
};

export const parseCandleData = (candles: IUpbitCandle[]): CandlestickData[] => {
  return pipe(
    candles,
    uniqBy((c) => c.timestamp),
    map((c) => ({
      time: c.timestamp as UTCTimestamp,
      open: c.opening_price,
      high: c.high_price,
      low: c.low_price,
      close: c.trade_price,
    })),
    reverse,
    toArray,
  ) as CandlestickData[];
};

export const parseVolumeData = (candles: IUpbitCandle[]): HistogramData[] => {
  return pipe(
    candles,
    uniqBy((c) => c.timestamp),
    map((c) => ({
      time: c.timestamp as UTCTimestamp,
      value: c.candle_acc_trade_volume,
      color: c.trade_price > c.opening_price ? '#3b69cb' : '#c43a3a',
    })),
    reverse,
    toArray,
  ) as HistogramData[];
};
