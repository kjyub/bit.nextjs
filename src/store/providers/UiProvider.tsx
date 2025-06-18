'use client';

import UserApi from "@/apis/api/users/UserApi";
import { useUser } from "@/hooks/useUser";
import { LocalStorageConsts } from "@/types/ApiTypes";
import { createContext, useEffect, useRef, useState } from "react";

export type ChartColorType = 'red-blue' | 'green-red';

interface UiContextType {
  chartColor: ChartColorType;
  setChartColor: (chartColor: ChartColorType) => void;
}

export const UiContext = createContext<UiContextType>({
  chartColor: 'red-blue',
  setChartColor: () => {},
});

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [chartColor, setChartColor] = useState<ChartColorType>('red-blue');
  const chartColorRef = useRef<ChartColorType>('red-blue');
  const { user, isAuth } = useUser();

  useEffect(() => {
    const chartColor = localStorage.getItem(LocalStorageConsts.CHART_COLOR);
    if (chartColor) {
      setChartColor(chartColor as ChartColorType);
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      setChartColor(user.chartColor);
    }
  }, [isAuth, user.chartColor]);

  useEffect(() => {
    chartColorRef.current = chartColor;
    updateChartColor(chartColor);

    UserApi.updateUser({
      chart_color: chartColorRef.current,
    });
  }, [chartColor])

  return <UiContext.Provider value={{ chartColor, setChartColor }}>{children}</UiContext.Provider>;
};

const updateChartColor = (chartColor: ChartColorType) => {
  if (chartColor === 'red-blue') {
    document.documentElement.style.setProperty('--color-position-long-1', '#ad2c2c');
    document.documentElement.style.setProperty('--color-position-long-2', '#c43a3a');
    document.documentElement.style.setProperty('--color-position-long-3', '#d74848');
    document.documentElement.style.setProperty('--color-position-long-strong', 'oklch(0.637 0.237 25.331)');

    document.documentElement.style.setProperty('--color-position-short-1', '#2d5ab9');
    document.documentElement.style.setProperty('--color-position-short-2', '#3b69cb');
    document.documentElement.style.setProperty('--color-position-short-3', '#4978dd');
    document.documentElement.style.setProperty('--color-position-short-strong', 'oklch(0.623 0.214 259.815)');
  } else if (chartColor === 'green-red') {
    document.documentElement.style.setProperty('--color-position-long-1', '#2db95a');
    document.documentElement.style.setProperty('--color-position-long-2', '#3bcb69');
    document.documentElement.style.setProperty('--color-position-long-3', '#49dd78');
    document.documentElement.style.setProperty('--color-position-long-strong', 'oklch(0.623 0.214 145)');

    document.documentElement.style.setProperty('--color-position-short-1', '#ad2c2c');
    document.documentElement.style.setProperty('--color-position-short-2', '#c43a3a');
    document.documentElement.style.setProperty('--color-position-short-3', '#d74848');
    document.documentElement.style.setProperty('--color-position-short-strong', 'oklch(0.637 0.237 25.331)');
  }

  localStorage.setItem(LocalStorageConsts.CHART_COLOR, chartColor);
}