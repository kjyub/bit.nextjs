'use client';

import UpbitApi from '@/apis/api/cryptos/UpbitApi';
import useTradeMarketChartSocket from '@/hooks/sockets/useTradeMarketChartSocket';
import { IUpbitCandle } from '@/types/cryptos/CryptoInterfaces';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import CryptoMarketChartControlBar from '../chart/ControlBar';
import { CANDLE_SIZE, CandleTimeType, CandleTimes, ChartType, ChartTypes } from '../chart/Types';

const CryptoMarketFinancialChart = dynamic(() => import('../chart/Chart'), { ssr: false });

const isSameTimeCandle = (lastCandle?: IUpbitCandle, candle: IUpbitCandle, timeType: CandleTimeType) => {
  if (!lastCandle) {
    return true;
  }

  const lastCandleTime = new Date(lastCandle.candle_date_time_kst);
  const candleTime = new Date(candle.candle_date_time_kst);

  switch (timeType) {
    case CandleTimes.SECOND:
      return lastCandleTime.getTime() + 1000 < candleTime.getTime();
    case CandleTimes.MINUTE1:
      return lastCandleTime.getMinutes() != candleTime.getMinutes();
    case CandleTimes.MINUTE3:
      return Math.floor(lastCandleTime.getMinutes() / 3) != Math.floor(candleTime.getMinutes() / 3);
    case CandleTimes.MINUTE5:
      return Math.floor(lastCandleTime.getMinutes() / 5) != Math.floor(candleTime.getMinutes() / 5);
    case CandleTimes.MINUTE10:
      return Math.floor(lastCandleTime.getMinutes() / 10) != Math.floor(candleTime.getMinutes() / 10);
    case CandleTimes.MINUTE15:
      return Math.floor(lastCandleTime.getMinutes() / 15) != Math.floor(candleTime.getMinutes() / 15);
    case CandleTimes.DAY:
      return lastCandleTime.getDate() != candleTime.getDate();
    case CandleTimes.WEEK:
      return (
        lastCandleTime.getDate() - candleTime.getDate() > 7 ||
        (lastCandleTime.getDay() == 0 && candleTime.getDay() == 6) ||
        (lastCandleTime.getDay() == 6 && candleTime.getDay() == 0)
      );
    case CandleTimes.MONTH:
      return lastCandleTime.getMonth() != candleTime.getMonth();
    default:
      return false;
  }
};

const mergeCandle = (candles: IUpbitCandle[], candle: IUpbitCandle, timeType: CandleTimeType) => {
  const isAdd = isSameTimeCandle(candles[0], candle, timeType);
  if (isAdd) {
    return [candle, ...candles];
  }
  if (candles.length === 0) {
    return [candle];
  }

  // 마지막 캔들이 같은 시간이라면, 마지막 캔들을 업데이트
  const newCandles = [...candles];
  const lastCandle = candle;
  if (candles[0].high_price > lastCandle.high_price) {
    lastCandle.high_price = candles[0].high_price;
  }
  if (candles[0].low_price < lastCandle.low_price) {
    lastCandle.low_price = candles[0].low_price;
  }
  lastCandle.candle_acc_trade_volume += candles[0].candle_acc_trade_volume;
  newCandles[0] = lastCandle;
  return newCandles;
};

interface ICryptoMarketChart {
  marketCode: string;
}
export default function CryptoMarketChart({ marketCode }: ICryptoMarketChart) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCandleLoading, setCandleLoading] = useState<boolean>(false);
  const [candles, setCandles] = useState<IUpbitCandle[]>([]);
  const [timeType, setTimeType] = useState<CandleTimeType>(CandleTimes.SECOND);
  const [chartType, setChartType] = useState<ChartType>(ChartTypes.AREA);

  useEffect(() => {
    initChart(CandleTimes.SECOND);
  }, [marketCode]);

  const initChart = useCallback(
    async (timeType: CandleTimeType) => {
      await getCandleData(timeType);
      connectChart(marketCode, timeType);
    },
    [marketCode],
  );

  const getBeforeCandleData = useCallback(async () => {
    if (isCandleLoading) {
      return;
    }
    if (candles.length === 0) {
      return;
    }

    setCandleLoading(true);

    const last = candles[candles.length - 1];
    const to = last.candle_date_time_kst + '+09:00';

    let newData = [];

    switch (timeType) {
      case CandleTimes.SECOND:
        newData = await UpbitApi.getCandleSeconds(marketCode, CANDLE_SIZE, to);
        break;
      case CandleTimes.MINUTE1:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 1, to);
        break;
      case CandleTimes.MINUTE3:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 3, to);
        break;
      case CandleTimes.MINUTE5:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 5, to);
        break;
      case CandleTimes.MINUTE10:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 10, to);
        break;
      case CandleTimes.MINUTE15:
        newData = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 15, to);
        break;
      case CandleTimes.DAY:
        newData = await UpbitApi.getCandleDays(marketCode, CANDLE_SIZE, to);
        break;
      case CandleTimes.WEEK:
        newData = await UpbitApi.getCandleWeeks(marketCode, CANDLE_SIZE, to);
        break;
      case CandleTimes.MONTH:
        newData = await UpbitApi.getCandleMonths(marketCode, CANDLE_SIZE, to);
        break;
      default:
        break;
    }

    const newCandles = [...candles, ...newData];
    setCandles(newCandles);
    setCandleLoading(false);

    return newCandles;
  }, [isCandleLoading, candles, marketCode, timeType]);

  const getCandleData = useCallback(
    async (timeType: CandleTimeType) => {
      if (isCandleLoading) {
        return;
      }
      setCandleLoading(true);
      setIsLoading(true);

      let data: IUpbitCandle[] = [];
      let chartType: ChartType = ChartTypes.CANDLE;

      switch (timeType) {
        case CandleTimes.SECOND:
          data = await UpbitApi.getCandleSeconds(marketCode, CANDLE_SIZE);
          chartType = ChartTypes.AREA;
          break;
        case CandleTimes.MINUTE1:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 1);
          break;
        case CandleTimes.MINUTE3:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 3);
          break;
        case CandleTimes.MINUTE5:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 5);
          break;
        case CandleTimes.MINUTE10:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 10);
          break;
        case CandleTimes.MINUTE15:
          data = await UpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 15);
          break;
        case CandleTimes.DAY:
          data = await UpbitApi.getCandleDays(marketCode, CANDLE_SIZE);
          break;
        case CandleTimes.WEEK:
          data = await UpbitApi.getCandleWeeks(marketCode, CANDLE_SIZE);
          break;
        case CandleTimes.MONTH:
          data = await UpbitApi.getCandleMonths(marketCode, CANDLE_SIZE);
          break;
        default:
          break;
      }

      setCandles(data);
      setTimeType(timeType);
      setChartType(chartType);
      setCandleLoading(false);
      setIsLoading(false);
    },
    [isCandleLoading, marketCode],
  );

  const addCandle = useCallback((candle: IUpbitCandle, timeType: CandleTimeType) => {
    setCandles((candles) => {
      return mergeCandle(candles, candle, timeType);
    });
  }, []);

  const connectChart = useTradeMarketChartSocket(marketCode, addCandle);

  return (
    <div className="flex flex-col h-full gap-2">
      <CryptoMarketChartControlBar
        timeType={timeType}
        chartType={chartType}
        setChartType={setChartType}
        initChart={initChart}
      />
      
      <div className="relative h-full select-none touch-none">
        <CryptoMarketFinancialChart
          timeType={timeType}
          chartType={chartType}
          candles={candles}
          getBeforeData={getBeforeCandleData}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
