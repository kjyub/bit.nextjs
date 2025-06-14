'use client';

import NextUpbitApi from '@/apis/api/cryptos/NextUpbitApi';
import useTradeMarketChartSocket from '@/hooks/sockets/useTradeMarketChartSocket';
import { useCryptoMarketTrade } from '@/hooks/useCryptoMarketTrade';
import useToastMessageStore from '@/store/useToastMessageStore';
import type { IUpbitCandle } from '@/types/cryptos/CryptoInterfaces';
import CryptoUtils from '@/utils/CryptoUtils';
import { CrosshairMode } from 'lightweight-charts';
import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CANDLE_SIZE, type CandleTimeType, CandleTimes, type ChartType, ChartTypes } from '../chart/Types';

const MAX_CANDLES = 100000;
const REMOVE_CANDLES = 1000;

interface CryptoMarketChartState {
  initChart: (timeType: CandleTimeType) => void;
  timeType: CandleTimeType;
  chartType: ChartType;
  setChartType: Dispatch<SetStateAction<ChartType>>;
  crosshairMode: CrosshairMode;
  setCrosshairMode: Dispatch<SetStateAction<CrosshairMode>>;
  getBeforeCandleData: () => void;
  candles: IUpbitCandle[];
  isLoading: boolean;
  isCandleLoading: boolean;
  selectedPriceRef: MutableRefObject<number | null>;
  updateTradePrice: () => void;
}

const initCryptoMarketChartState: CryptoMarketChartState = {
  initChart: () => {},
  timeType: CandleTimes.MINUTE1,
  chartType: ChartTypes.AREA,
  setChartType: () => {},
  crosshairMode: CrosshairMode.Normal,
  setCrosshairMode: () => {},
  getBeforeCandleData: () => {},
  candles: [],
  isLoading: true,
  isCandleLoading: false,
  selectedPriceRef: { current: null },
  updateTradePrice: () => {},
};

const CryptoMarketChartContext = createContext<CryptoMarketChartState>(initCryptoMarketChartState);

const isSameTimeCandle = (lastCandle: IUpbitCandle, candle: IUpbitCandle, timeType: CandleTimeType) => {
  if (!lastCandle) {
    return true;
  }

  const lastCandleTime = new Date(lastCandle.candle_date_time_kst);
  const candleTime = new Date(candle.candle_date_time_kst);

  switch (timeType) {
    case CandleTimes.SECOND:
      return lastCandleTime.getTime() + 1000 < candleTime.getTime();
    case CandleTimes.MINUTE1:
      return lastCandleTime.getMinutes() !== candleTime.getMinutes();
    case CandleTimes.MINUTE3:
      return Math.floor(lastCandleTime.getMinutes() / 3) !== Math.floor(candleTime.getMinutes() / 3);
    case CandleTimes.MINUTE5:
      return Math.floor(lastCandleTime.getMinutes() / 5) !== Math.floor(candleTime.getMinutes() / 5);
    case CandleTimes.MINUTE10:
      return Math.floor(lastCandleTime.getMinutes() / 10) !== Math.floor(candleTime.getMinutes() / 10);
    case CandleTimes.MINUTE15:
      return Math.floor(lastCandleTime.getMinutes() / 15) !== Math.floor(candleTime.getMinutes() / 15);
    case CandleTimes.MINUTE60:
      return Math.floor(lastCandleTime.getMinutes() / 60) !== Math.floor(candleTime.getMinutes() / 60);
    case CandleTimes.MINUTE240:
      return Math.floor(lastCandleTime.getMinutes() / 240) !== Math.floor(candleTime.getMinutes() / 240);
    case CandleTimes.DAY:
      return lastCandleTime.getDate() !== candleTime.getDate();
    case CandleTimes.WEEK:
      return (
        lastCandleTime.getDate() - candleTime.getDate() > 7 ||
        (lastCandleTime.getDay() === 0 && candleTime.getDay() === 6) ||
        (lastCandleTime.getDay() === 6 && candleTime.getDay() === 0)
      );
    case CandleTimes.MONTH:
      return lastCandleTime.getMonth() !== candleTime.getMonth();
    default:
      return false;
  }
};

// 최신 데이터 추가
const mergeCandle = (candles: IUpbitCandle[], candle: IUpbitCandle, timeType: CandleTimeType) => {
  if (candles.length === 0) {
    return [candle];
  }

  let oldCandles = [...candles];
  // 최대 개수 초과 시, 과거 데이터 제거
  if (candles.length > MAX_CANDLES) {
    oldCandles = candles.slice(0, MAX_CANDLES - REMOVE_CANDLES);
  }

  // 최신 데이터가 마지막 데이터랑 다른 시간인 경우 추가
  const isAdd = isSameTimeCandle(oldCandles[0], candle, timeType);
  if (isAdd) {
    return [candle, ...oldCandles];
  }

  // 마지막 캔들이 같은 시간이라면, 마지막 캔들을 업데이트
  const newCandles = [...oldCandles];
  const lastCandle = candle;
  if (oldCandles[0].high_price > lastCandle.high_price) {
    lastCandle.high_price = oldCandles[0].high_price;
  }
  if (oldCandles[0].low_price < lastCandle.low_price) {
    lastCandle.low_price = oldCandles[0].low_price;
  }
  lastCandle.candle_acc_trade_volume += oldCandles[0].candle_acc_trade_volume;
  newCandles[0] = lastCandle;
  return newCandles;
};

interface ICryptoMarketChart {
  marketCode: string;
  children: React.ReactNode;
}
export default function CryptoMarketChartProvider({ marketCode, children }: ICryptoMarketChart) {
  const createToastMessage = useToastMessageStore((state) => state.createMessage);
  const { setTradePrice } = useCryptoMarketTrade();
  const { createMessage } = useToastMessageStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCandleLoading, setCandleLoading] = useState<boolean>(false);
  const [candles, setCandles] = useState<IUpbitCandle[]>([]);
  const [timeType, setTimeType] = useState<CandleTimeType>(CandleTimes.MINUTE1);
  const [chartType, setChartType] = useState<ChartType>(ChartTypes.AREA);
  const [crosshairMode, setCrosshairMode] = useState<CrosshairMode>(CrosshairMode.Normal);

  const isCandleLoadingRef = useRef(isCandleLoading);
  const candlesRef = useRef(candles);
  const timeTypeRef = useRef<CandleTimeType>(CandleTimes.SECOND);
  const isFullCandlesRef = useRef(false);

  const selectedPriceRef = useRef<number | null>(null);

  useEffect(() => {
    initChart(CandleTimes.MINUTE1);
  }, [marketCode]);

  useEffect(() => {
    candlesRef.current = candles;
  }, [candles]);

  useEffect(() => {
    timeTypeRef.current = timeType;
  }, [timeType]);

  const initChart = useCallback(
    async (timeType: CandleTimeType) => {
      await getCandleData(timeType);
      console.log('[차트] 초기화');
      connectChart(marketCode, timeType);
    },
    [marketCode],
  );

  const getBeforeCandleData = useCallback(async () => {
    if (isCandleLoadingRef.current) return;
    if (candlesRef.current.length === 0) return;

    // 최대 개수 메세지용
    if (candlesRef.current.length > MAX_CANDLES && !isFullCandlesRef.current) {
      isFullCandlesRef.current = true;
      createToastMessage('차트 데이터가 너무 많습니다.');
      return;
    }

    // 최대 개수
    if (isFullCandlesRef.current) return;

    setCandleLoading(true);
    isCandleLoadingRef.current = true;

    const last = candlesRef.current[candlesRef.current.length - 1];
    const to = `${last.candle_date_time_kst}+09:00`;

    let newData: IUpbitCandle[] = [];

    switch (timeTypeRef.current) {
      case CandleTimes.SECOND:
        newData = await NextUpbitApi.getCandleSeconds(marketCode, CANDLE_SIZE, to);
        break;
      case CandleTimes.MINUTE1:
        newData = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 1, to);
        break;
      case CandleTimes.MINUTE3:
        newData = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 3, to);
        break;
      case CandleTimes.MINUTE5:
        newData = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 5, to);
        break;
      case CandleTimes.MINUTE10:
        newData = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 10, to);
        break;
      case CandleTimes.MINUTE15:
        newData = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 15, to);
        break;
      case CandleTimes.MINUTE60:
        newData = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 60, to);
        break;
      case CandleTimes.MINUTE240:
        newData = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 240, to);
        break;
      case CandleTimes.DAY:
        newData = await NextUpbitApi.getCandleDays(marketCode, CANDLE_SIZE, to);
        break;
      case CandleTimes.WEEK:
        newData = await NextUpbitApi.getCandleWeeks(marketCode, CANDLE_SIZE, to);
        break;
      case CandleTimes.MONTH:
        newData = await NextUpbitApi.getCandleMonths(marketCode, CANDLE_SIZE, to);
        break;
      default:
        break;
    }

    setCandles((prevCandles) => [...prevCandles, ...newData]);
    setCandleLoading(false);
    isCandleLoadingRef.current = false;

    return newData;
  }, [marketCode, timeType]);

  const getCandleData = useCallback(
    async (timeType: CandleTimeType) => {
      if (isCandleLoadingRef.current) return;
      setCandleLoading(true);
      isCandleLoadingRef.current = true;
      setIsLoading(true);

      let data: IUpbitCandle[] = [];
      let chartType: ChartType = ChartTypes.CANDLE;

      switch (timeType) {
        case CandleTimes.SECOND:
          data = await NextUpbitApi.getCandleSeconds(marketCode, CANDLE_SIZE);
          chartType = ChartTypes.AREA;
          break;
        case CandleTimes.MINUTE1:
          data = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 1);
          chartType = ChartTypes.AREA;
          break;
        case CandleTimes.MINUTE3:
          data = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 3);
          break;
        case CandleTimes.MINUTE5:
          data = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 5);
          break;
        case CandleTimes.MINUTE10:
          data = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 10);
          break;
        case CandleTimes.MINUTE15:
          data = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 15);
          break;
        case CandleTimes.MINUTE60:
          data = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 60);
          break;
        case CandleTimes.MINUTE240:
          data = await NextUpbitApi.getCandleMinutes(marketCode, CANDLE_SIZE, 240);
          break;
        case CandleTimes.DAY:
          data = await NextUpbitApi.getCandleDays(marketCode, CANDLE_SIZE);
          break;
        case CandleTimes.WEEK:
          data = await NextUpbitApi.getCandleWeeks(marketCode, CANDLE_SIZE);
          break;
        case CandleTimes.MONTH:
          data = await NextUpbitApi.getCandleMonths(marketCode, CANDLE_SIZE);
          break;
        default:
          break;
      }

      setCandles(data);
      setTimeType(timeType);
      setChartType(chartType);
      setCandleLoading(false);
      isCandleLoadingRef.current = false;
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

  const updateTradePrice = useCallback(() => {
    if (selectedPriceRef.current === null) return;

    setTradePrice(selectedPriceRef.current);
    createMessage(`${CryptoUtils.getPriceText(selectedPriceRef.current)} 거래 가격 설정`);
  }, []);

  return (
    <CryptoMarketChartContext.Provider
      value={{
        initChart,
        timeType,
        chartType,
        setChartType,
        crosshairMode,
        setCrosshairMode,
        getBeforeCandleData,
        candles,
        isLoading,
        isCandleLoading,
        selectedPriceRef,
        updateTradePrice,
      }}
    >
      {children}
    </CryptoMarketChartContext.Provider>
  );
}

export const useCryptoMarketChart = () => {
  return useContext(CryptoMarketChartContext);
};
