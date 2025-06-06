// https://tradingview.github.io/lightweight-charts/docs

import { useEffect, useRef } from "react";
import { createChart, ColorType, IChartApi, AreaSeries, ISeriesApi, CandlestickSeries, CrosshairMode, ChartOptions, DeepPartial, AreaSeriesOptions, CandlestickSeriesOptions, BarSeries, BarSeriesOptions, HistogramSeries, HistogramSeriesOptions } from 'lightweight-charts';
import { useCryptoMarketChart } from "../market/CryptoMarketChartProvider";
import CryptoUtils from "@/utils/CryptoUtils";
import { getTimeFormatter, parseAreaData, parseCandleData, parseVolumeData } from "./utils";
import { CandleTimes, ChartTypes } from "./Types";
import { cn } from "@/utils/StyleUtils";

const UP_COLOR = '#3b69cb';
const DOWN_COLOR = '#c43a3a';

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
  lineColor: "#6408e4",
  topColor: "rgba(119, 39, 230, 0.9)",
  bottomColor: "rgba(127, 34, 254, 0.1)",
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
  }
} as const;

const volumeSeriesOptions: DeepPartial<HistogramSeriesOptions> = {
  color: '#6408e4',
  priceFormat: {
    type: 'volume',
    // formatter: (price: number) => {
    //   return CryptoUtils.getPriceText(price);
    // },
  },
  priceScaleId: '',
  // scaleMargins: {
  //   top: 0.8,
  //   bottom: 0,
  // },
} as const;

export default function TradingChart() {
  const { timeType, chartType, candles, getBeforeCandleData, isLoading } = useCryptoMarketChart();

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current as HTMLElement, chartOptions)
    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (!range) return;

      const logicalFrom = range.from;
      if (logicalFrom <= 0) {
        (async () => {
          await getBeforeCandleData();
        })();
      }
    })

    chartRef.current = chart;
  }, [])

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    // 새로운 시리즈 추가
    if (chartType === ChartTypes.AREA) {
      // 기존 시리즈 제거
      if (candleSeriesRef.current) {
        chart.removeSeries(candleSeriesRef.current as ISeriesApi<'Candlestick'>);
      }

      const areaSeries = chart.addSeries(AreaSeries, areaSeriesOptions);
      areaSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.2,
          bottom: 0.3,
        }
      })
      areaSeriesRef.current = areaSeries;
    } else if (chartType === ChartTypes.CANDLE) {
      // 기존 시리즈 제거
      if (areaSeriesRef.current) {
        chart.removeSeries(areaSeriesRef.current as ISeriesApi<'Area'>);
      }

      const candleSeries = chart.addSeries(CandlestickSeries, candleSeriesOptions);
      candleSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.2,
          bottom: 0.3,
        }
      })
      candleSeriesRef.current = candleSeries;
    }

    if (volumeSeriesRef.current) {
      chart.removeSeries(volumeSeriesRef.current as ISeriesApi<'Histogram'>);
    }

    const volumeSeries = chart.addSeries(HistogramSeries, volumeSeriesOptions);
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    })
    volumeSeriesRef.current = volumeSeries;
  }, [chartType])

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
      }
    })
  }, [timeType])

  useEffect(() => {
    if (chartType === ChartTypes.AREA && areaSeriesRef.current) {
      areaSeriesRef.current.setData(parseAreaData(candles));
    } else if (chartType === ChartTypes.CANDLE && candleSeriesRef.current) {
      candleSeriesRef.current.setData(parseCandleData(candles));
    }    

    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(parseVolumeData(candles));
    }
  }, [candles, chartType])

  return (
    <div className="relative flex flex-col w-full h-full">
      <div ref={chartContainerRef} className="relative w-full flex-1">
      </div>
      <div 
        className={cn([
          'absolute top-0 left-0 z-10 w-full h-full rounded-lg bg-slate-800', 
          { 'opacity-100 animate-pulse': isLoading },
          { 'opacity-0 pointer-events-none': !isLoading },
        ])}
      ></div>
      {/* <div ref={volumeChartContainerRef} className="relative w-full h-36">
      </div> */}
    </div>
  );
}