// https://tradingview.github.io/lightweight-charts/docs

import useUserInfoStore from '@/store/useUserInfo';
import CryptoUtils from '@/utils/CryptoUtils';
import { cn } from '@/utils/StyleUtils';
import {
  AreaSeries,
  type AreaSeriesOptions,
  BarSeries,
  BarSeriesOptions,
  CandlestickSeries,
  type CandlestickSeriesOptions,
  type ChartOptions,
  ColorType,
  type CreatePriceLineOptions,
  CrosshairMode,
  type DeepPartial,
  HistogramSeries,
  type HistogramSeriesOptions,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  createChart,
} from 'lightweight-charts';
import { type MutableRefObject, useEffect, useRef } from 'react';
import { useCryptoMarketChart } from '../market/CryptoMarketChartProvider';
import { CandleTimes, ChartTypes } from './Types';
import { DOWN_COLOR, getTimeFormatter, parseAreaData, parseCandleData, parseVolumeData, UP_COLOR } from './utils';
import useBreakpoint from '@/hooks/useBreakpoint';

const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    background: {
      type: ColorType.Solid,
      color: 'transparent',
    },
    fontFamily: 'Pretendard',
    textColor: '#cad5e2',
    fontSize: 12,
  },
  grid: {
    vertLines: {
      color: 'oklch(0.554 0.046 257.417 / 0.3)',
    },
    horzLines: {
      color: 'oklch(0.554 0.046 257.417 / 0.3)',
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  localization: {
    timeFormatter: getTimeFormatter(CandleTimes.SECOND),
  },
  rightPriceScale: {
    scaleMargins: {
      top: 0.3,
      bottom: 0.3,
    },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: true,
  },
  // overlayPriceScales: {
  //   scaleMargins: {
  //     top: 0.9,
  //     bottom: 0,
  //   },
  // },
} as const;

const areaSeriesOptions: DeepPartial<AreaSeriesOptions> = {
  lineColor: '#822afd',
  topColor: 'rgba(119, 39, 230, 0.9)',
  bottomColor: 'rgba(127, 34, 254, 0.1)',
  priceFormat: {
    type: 'custom',
    formatter: (price: number) => {
      return CryptoUtils.getPriceText(price);
    },
  },
} as const;

const candleSeriesOptions: DeepPartial<CandlestickSeriesOptions> = {
  upColor: UP_COLOR,
  downColor: DOWN_COLOR,
  borderVisible: false,
  wickUpColor: UP_COLOR,
  wickDownColor: DOWN_COLOR,
  priceFormat: {
    type: 'custom',
    formatter: (price: number) => {
      return CryptoUtils.getPriceText(price);
    },
  },
} as const;

const volumeSeriesOptions: DeepPartial<HistogramSeriesOptions> = {
  color: '#6408e4',
  priceFormat: {
    type: 'custom',
    formatter: (price: number) => {
      return CryptoUtils.getPriceText(price);
    },
  },
  priceScaleId: '',
  // scaleMargins: {
  //   top: 0.8,
  //   bottom: 0,
  // },
} as const;

interface Props {
  marketCode: string;
}
export default function TradingChart({ marketCode }: Props) {
  const { timeType, chartType, candles, getBeforeCandleData, isLoading } = useCryptoMarketChart();
  const { updateInfo, myTrades } = useUserInfoStore();

  const { breakpointState } = useBreakpoint();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const entryPriceLineRef = useRef<IPriceLine | null>(null);
  const liqPriceLineRef = useRef<IPriceLine | null>(null);

  // 차트 생성
  useEffect(() => {
    updateInfo();

    const chart = createChart(chartContainerRef.current as HTMLElement, chartOptions);
    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (!range) return;

      const logicalFrom = range.from;
      if (logicalFrom <= 0) {
        (async () => {
          await getBeforeCandleData();
        })();
      }
    });

    chartRef.current = chart;
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const rect = chartContainerRef.current?.getBoundingClientRect();
      if (rect) {
        chartRef.current.resize(rect.width, rect.height);
      }
    }
  }, [breakpointState]);

  // 차트 타입 변경 및 시리즈 재설정
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    // 새로운 시리즈 추가
    if (chartType === ChartTypes.AREA) {
      // 기존 시리즈 제거
      if (candleSeriesRef.current) {
        try {
          chart.removeSeries(candleSeriesRef.current as ISeriesApi<'Candlestick'>);
        } catch {
          // 차트에 시리즈가 없어서 생기는 오류
        }
      }

      const areaSeries = chart.addSeries(AreaSeries, areaSeriesOptions);
      areaSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.2,
          bottom: 0.3,
        },
      });
      areaSeriesRef.current = areaSeries;
    } else if (chartType === ChartTypes.CANDLE) {
      // 기존 시리즈 제거
      if (areaSeriesRef.current) {
        try {
          chart.removeSeries(areaSeriesRef.current as ISeriesApi<'Area'>);
        } catch {
          // 차트에 시리즈가 없어서 생기는 오류
        }
      }

      const candleSeries = chart.addSeries(CandlestickSeries, candleSeriesOptions);
      candleSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.2,
          bottom: 0.3,
        },
      });
      candleSeriesRef.current = candleSeries;
    }

    if (volumeSeriesRef.current) {
      try {
        chart.removeSeries(volumeSeriesRef.current as ISeriesApi<'Histogram'>);
      } catch {
        // 차트에 시리즈가 없어서 생기는 오류
      }
    }

    const volumeSeries = chart.addSeries(HistogramSeries, volumeSeriesOptions);
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });
    volumeSeriesRef.current = volumeSeries;
  }, [chartType]);

  // 시간 타입 변경
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    chart.applyOptions({
      localization: {
        timeFormatter: getTimeFormatter(timeType),
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        tickMarkFormatter: getTimeFormatter(timeType),
      },
    });
  }, [timeType]);

  // 캔들 데이터 업데이트
  useEffect(() => {
    if (chartType === ChartTypes.AREA && areaSeriesRef.current) {
      areaSeriesRef.current.setData(parseAreaData(candles));
    } else if (chartType === ChartTypes.CANDLE && candleSeriesRef.current) {
      candleSeriesRef.current.setData(parseCandleData(candles));
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(parseVolumeData(candles));
    }
  }, [candles, chartType]);

  // 현재 내 포지션 정보
  useEffect(() => {
    const positon = myTrades.positions.find((position) => position.market.code === marketCode);
    if (!positon) return;

    const entryPrice = Number(positon.entryPrice);
    const liqPrice = Number(positon.liquidatePrice);

    const entryPriceLine: CreatePriceLineOptions = {
      price: entryPrice,
      color: '#2c7a25',
      lineWidth: 1,
      axisLabelVisible: true,
      title: '진입 가격',
    };
    const liqPriceLine: CreatePriceLineOptions = {
      price: liqPrice,
      color: '#c43a3a',
      lineWidth: 1,
      axisLabelVisible: true,
      title: '청산 가격',
    };

    let seriesRef: MutableRefObject<ISeriesApi<'Area' | 'Candlestick'> | null> | null = null;

    if (chartType === ChartTypes.AREA && areaSeriesRef.current) {
      seriesRef = areaSeriesRef;
    } else if (chartType === ChartTypes.CANDLE && candleSeriesRef.current) {
      seriesRef = candleSeriesRef;
    }

    if (seriesRef?.current) {
      if (entryPriceLineRef.current) {
        seriesRef.current.removePriceLine(entryPriceLineRef.current);
      }
      if (liqPriceLineRef.current) {
        seriesRef.current.removePriceLine(liqPriceLineRef.current);
      }

      entryPriceLineRef.current = seriesRef.current.createPriceLine(entryPriceLine);
      liqPriceLineRef.current = seriesRef.current.createPriceLine(liqPriceLine);
    }
  }, [myTrades.positions, marketCode, chartType]);

  return (
    <div className="relative flex flex-col w-full h-full">
      <div ref={chartContainerRef} className={cn(['relative w-full flex-1', { 'animate-pulse': isLoading }])}></div>
      {/* <div ref={volumeChartContainerRef} className="relative w-full h-36">
      </div> */}
    </div>
  );
}
