'use client';

import CryptoApi from "@/apis/api/cryptos/CryptoApi";
import { useDetectClose } from "@/hooks/useDetectClose";
import useFocus from "@/hooks/useFocus";
import type CryptoMarket from "@/types/cryptos/CryptoMarket";
import { MarketTypes } from "@/types/cryptos/CryptoTypes";
import { cn } from "@/utils/StyleUtils";
import { useEffect, useState, useMemo } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative w-full h-11 z-20">
      <div className="absolute w-full h-11 z-20">
        {children}
      </div>
    </div>
  )
}

interface IFlexSearch {
  onSearch: (search: string) => void;
}
export default function FlexSearch({ onSearch }: IFlexSearch) {
  const [ref, isFocused, setIsFocused] = useDetectClose<HTMLDivElement>();
  const [value, setValue] = useState<string>('');
  const [markets, setMarkets] = useState<Array<CryptoMarket>>([]);

  useEffect(() => {
    (async () => {
      const markets = await CryptoApi.getMarkets("", MarketTypes.BTC);
      setMarkets(markets);
    })()
  }, [])

  const filteredMarkets = useMemo(() => {
    if (value.length === 0) {
      return markets;
    }

    const searchLower = value.toLowerCase();
    const searchUpper = value.toUpperCase();
    
    return markets.filter((market) => {
      return (
        market.koreanName.toLowerCase().includes(searchLower) ||
        market.englishName.toLowerCase().includes(searchLower) ||
        market.code.includes(searchUpper)
      );
    });
  }, [markets, value]);

  const onSelect = (market: CryptoMarket) => {
    setValue(market.koreanName);
    onSearch(market.code);
    setIsFocused(false);
  }

  return (
    <Layout>
      <div ref={ref} className="relative flex flex-col w-full px-1 py-1 gap-3">
        {/* 검색 박스 */}
        <div
          className={cn([
            'z-10 flex items-center w-full px-3 py-2 space-x-2 transition-colors rounded-lg',
            { 'bg-slate-500/20': isFocused }
          ])}
        >
          <input
            className={'w-full bg-transparent text-sm text-slate-300 placeholder:text-slate-500'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(value)}
            placeholder="코인 검색"
            onFocus={() => setIsFocused(true)}
          />

          <button 
            className={cn([
              'text-slate-400 hover:text-slate-300 text-[11px] rounded-full bg-slate-400/40',
              'flex items-center justify-center aspect-square h-3.5 duration-200',
              { 'opacity-0': value.length === 0 }
            ])} 
            type="button" 
            onClick={() => setValue('')}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <button className={'text-slate-400 hover:text-slate-200 text-sm'} type="button">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        {/* 검색 결과 */}
        {isFocused && filteredMarkets.length > 0 && (
          <div className="z-10 flex flex-col w-full max-h-[24rem] gap-2 overflow-y-auto scroll-transparent">
            {filteredMarkets.map((market) => (
              <Item key={market.code} market={market} searchValue={value} onSelect={onSelect} />
            ))}
          </div>
        )}
        
        {/* 배경 */}
        <div 
          className={cn([
            'absolute z-0 top-0 inset-x-0 size-full rounded-xl max-md:border border-slate-500/20 layer1 backdrop-blur-lg',
            'transition-all duration-300 ease-out transform-gpu pointer-events-none',
            { 'layer1-1 w-[calc(100%+0.8rem)] h-[calc(100%+0.8rem)] translate-x-[-0.4rem] translate-y-[-0.4rem]': isFocused }
          ])}
        />
      </div>
    </Layout>
  );
}

interface HightLightText {
  text: string;
  isHighlight: boolean;
}
const highlightText = (text: string, searchValue: string): Array<HightLightText> => {
  if (!searchValue.trim()) return [{ text, isHighlight: false }];
  
  const searchLower = searchValue.toLowerCase();
  const textLower = text.toLowerCase();
  const parts: Array<HightLightText> = [];
  
  let lastIndex = 0;
  let searchIndex = textLower.indexOf(searchLower, lastIndex);
  
  while (searchIndex !== -1) {
    // 매칭 전 부분
    if (searchIndex > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, searchIndex),
        isHighlight: false
      });
    }
    
    // 매칭된 부분
    parts.push({
      text: text.slice(searchIndex, searchIndex + searchValue.length),
      isHighlight: true
    });
    
    lastIndex = searchIndex + searchValue.length;
    searchIndex = textLower.indexOf(searchLower, lastIndex);
  }
  
  // 나머지 부분
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isHighlight: false
    });
  }
  
  return parts;
};

const Item = ({ market, searchValue, onSelect }: { market: CryptoMarket, searchValue: string, onSelect: (market: CryptoMarket) => void }) => {
  const koreanHighlights = useMemo(() => 
    highlightText(market.koreanName, searchValue), 
    [market.koreanName, searchValue]
  );
  
  const codeHighlights = useMemo(() => 
    highlightText(market.code, searchValue), 
    [market.code, searchValue]
  );

  return (
    <div className="flex justify-between items-center w-full px-3 py-2 gap-2 hover:bg-slate-500/20 rounded-lg" onClick={() => onSelect(market)}>
      <div className="text-sm text-slate-300">
        {koreanHighlights.map((part, index) => (
          <span 
            key={index} 
            className={cn([
              { 'text-indigo-500 font-medium': part.isHighlight }
            ])}
          >
            {part.text}
          </span>
        ))}
      </div>
      <div className="text-xs text-slate-400">
        {codeHighlights.map((part, index) => (
          <span 
            key={index} 
            className={cn([
              { 'text-indigo-500 font-medium': part.isHighlight }
            ])}
          >
            {part.text}
          </span>
        ))}
      </div>
    </div>
  );
};
