// https://tradingview.github.io/lightweight-charts/docs

import useBreakpoint from '@/hooks/useBreakpoint';
import useUserInfoStore from '@/store/useUserInfo';
import { TextFormats } from '@/types/CommonTypes';
import FormatUtils from '@/utils/FormatUtils';
import CryptoUtils from '@/utils/CryptoUtils';
import { cn } from '@/utils/StyleUtils';
import {
  AreaSeries,
  type AreaSeriesOptions,
  CandlestickSeries,
  type CandlestickSeriesOptions,
  type ChartOptions,
  ColorType,
  type CreatePriceLineOptions,
  CrosshairMode,
  type CustomData,
  type DeepPartial,
  HistogramSeries,
  type HistogramSeriesOptions,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
  createChart,
} from 'lightweight-charts';
import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { useCryptoMarketChart } from '../market/MarketChartProvider';
import { CandleTimes, ChartTypes } from './Types';
import { getDownColor, getTimeFormatter, getUpColor, parseAreaData, parseCandleData, parseVolumeData } from './utils';

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
    vertLine: {
      labelBackgroundColor: '#6408e4',
    },
    horzLine: {
      labelBackgroundColor: '#6408e4',
    },
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
} as const;

const areaSeriesOptions: DeepPartial<AreaSeriesOptions> = {
  lineColor: '#8a3bf8',
  topColor: 'rgba(119, 39, 230, 0.9)',
  bottomColor: 'rgba(127, 34, 254, 0.1)',
  priceFormat: {
    type: 'custom',
    minMove: 0.0000001,
    formatter: (price: number) => {
      return FormatUtils.textFormat(CryptoUtils.getPriceUnit(price), TextFormats.NUMBER);
    },
  },
  crosshairMarkerVisible: false,
  // crosshairMarkerBackgroundColor: '#2afd38',
} as const;

const candleSeriesOptions = () => ({
  upColor: getUpColor(),
  downColor: getDownColor(),
  borderVisible: false,
  wickUpColor: getUpColor(),
  wickDownColor: getDownColor(),
  priceFormat: {
    type: 'custom' as const,
    minMove: 0.0000001,
    formatter: (price: number) => {
      return FormatUtils.textFormat(CryptoUtils.getPriceUnit(price), TextFormats.NUMBER);
    },
  },
});

const volumeSeriesOptions: DeepPartial<HistogramSeriesOptions> = {
  color: '#6408e4',
  priceFormat: {
    type: 'custom',
    formatter: (price: number) => {
      return CryptoUtils.getPriceText(price);
    },
  },
  priceScaleId: '',
} as const;

interface Props {
  marketCode: string;
}
export default function TradingChart({ marketCode }: Props) {
  const {
    timeType,
    chartType,
    crosshairMode,
    candles,
    getBeforeCandleData,
    isLoading,
    selectedPriceRef,
    updateTradePrice,
  } = useCryptoMarketChart();
  const { updateInfo, myTrades } = useUserInfoStore();

  const { breakpointState } = useBreakpoint();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const entryPriceLineRef = useRef<IPriceLine | null>(null);
  const liqPriceLineRef = useRef<IPriceLine | null>(null);

  const crosshairModeRef = useRef<CrosshairMode>(CrosshairMode.Normal);
  const isCrossHairActiveRef = useRef<boolean>(false);

  // 차트 생성
  useEffect(() => {
    updateInfo();

    try {
      chartRef.current?.remove();
    } catch {
      //
    }

    // 현재 마우스 위치의 가격 가져오기
    const getChartCrosshairPrice = (param: MouseEventParams): number | null => {
      let value: number | null = null;

      if (crosshairModeRef.current === CrosshairMode.Normal) {
        let seriesRef: ISeriesApi<'Area' | 'Candlestick'> | null = null;
        if (areaSeriesRef.current) {
          seriesRef = areaSeriesRef.current;
        } else if (candleSeriesRef.current) {
          seriesRef = candleSeriesRef.current;
        }

        if (!seriesRef) return null;
        const priceFromCoordinate = seriesRef.coordinateToPrice(param.point?.y ?? 0);
        value = priceFromCoordinate ?? null;
      } else if (crosshairModeRef.current === CrosshairMode.Magnet) {
        if (areaSeriesRef.current) {
          const data: ({ value?: number } & CustomData<Time>) | undefined = param.seriesData.get(areaSeriesRef.current);
          value = data?.value ?? null;
        } else if (candleSeriesRef.current) {
          const data: ({ close?: number } & CustomData<Time>) | undefined = param.seriesData.get(
            candleSeriesRef.current,
          );
          value = data?.close ?? null;
        }
      }

      if (!value) return null;

      return CryptoUtils.getPriceUnit(value);
    };

    const chart = createChart(chartContainerRef.current as HTMLElement, chartOptions);
    // 과거 데이터 불러오기
    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (!range) return;

      const logicalFrom = range.from;
      if (logicalFrom <= 0) {
        (async () => {
          await getBeforeCandleData();
        })();
      }
    });
    // 크로스 헤어 이동 시
    chart.subscribeCrosshairMove((param) => {
      isCrossHairActiveRef.current = !!param.point;
      if (!param.point) return;

      const price = getChartCrosshairPrice(param);
      if (price === null) return;

      selectedPriceRef.current = price;
    });
    // 차트 클릭 시
    chart.subscribeClick((param) => {
      const price = getChartCrosshairPrice(param);
      if (price === null) return;

      // 마우스 환경인 경우
      if (window.matchMedia('(pointer: fine)').matches) {
        updateTradePrice();
      }
    });

    chartRef.current = chart;

    // 차트 색상 css 변화 감지
    const target = document.documentElement;

    const observer = new MutationObserver(() => {
      updateChartColor();
    });

    observer.observe(target, {
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => observer.disconnect();
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
          candleSeriesRef.current = null;
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
          areaSeriesRef.current = null;
        } catch {
          // 차트에 시리즈가 없어서 생기는 오류
        }
      }

      const candleSeries = chart.addSeries(CandlestickSeries, candleSeriesOptions());
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

  // 크로스 헤어 모드 변경
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    chart.applyOptions({
      crosshair: {
        mode: crosshairMode,
      },
    });
    crosshairModeRef.current = crosshairMode;
  }, [crosshairMode]);

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

    // 최신 캔들을 활성 가격으로 설정 (거래 가격 설정에 사용됨)
    if (candles.length > 0 && !isCrossHairActiveRef.current) {
      selectedPriceRef.current = Number(candles[0].trade_price);
    }
  }, [candles, chartType]);

  // 현재 내 포지션 정보
  useEffect(() => {
    let seriesRef: MutableRefObject<ISeriesApi<'Area' | 'Candlestick'> | null> | null = null;

    if (chartType === ChartTypes.AREA && areaSeriesRef.current) {
      seriesRef = areaSeriesRef;
    } else if (chartType === ChartTypes.CANDLE && candleSeriesRef.current) {
      seriesRef = candleSeriesRef;
    }

    const positon = myTrades.positions.find((position) => position.market.code === marketCode);
    if (!positon) {
      if (entryPriceLineRef.current) {
        seriesRef?.current?.removePriceLine(entryPriceLineRef.current);
        entryPriceLineRef.current = null;
      }
      if (liqPriceLineRef.current) {
        seriesRef?.current?.removePriceLine(liqPriceLineRef.current);
        liqPriceLineRef.current = null;
      }
      return;
    }

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

  const updateChartColor = useCallback(() => {
    if (candleSeriesRef.current) {
      candleSeriesRef.current.applyOptions({
        upColor: getUpColor(),
        downColor: getDownColor(),
        wickUpColor: getUpColor(),
        wickDownColor: getDownColor(),
      });
      candleSeriesRef.current.setData(parseCandleData(candles));
    }

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(parseVolumeData(candles));
    }
  }, [candles]);

  return (
    <div className="relative flex flex-col w-full h-full">
      <div ref={chartContainerRef} className={cn(['relative w-full flex-1', { 'animate-pulse': isLoading }])}></div>
    </div>
  );
}
