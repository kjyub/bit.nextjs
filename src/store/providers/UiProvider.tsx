'use client';

import { createContext, useState } from "react";

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

  return <UiContext.Provider value={{ chartColor, setChartColor }}>{children}</UiContext.Provider>;
};