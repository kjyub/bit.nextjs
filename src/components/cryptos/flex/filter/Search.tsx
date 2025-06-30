'use client';

import CryptoApi from "@/apis/api/cryptos/CryptoApi";
import { useDetectClose } from "@/hooks/useDetectClose";
import type CryptoMarket from "@/types/cryptos/CryptoMarket";
import { MarketTypes } from "@/types/cryptos/CryptoTypes";
import { cn } from "@/utils/StyleUtils";
import { filter, map, pipe, reverse, sortBy, toArray } from "@fxts/core";
import { getChoseong } from "es-hangul";
import { useEffect, useState, useMemo } from "react";
import { attachHighlightMarket, type MarketWithHighlight } from "./utils";

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
      const markets = await CryptoApi.getMarkets("", MarketTypes.KRW);
      setMarkets(markets);
    })()
  }, [])

  const searchedMarkets: Array<MarketWithHighlight> = useMemo(() => {
    if (value.length === 0) {
      return markets.map((market) => attachHighlightMarket(market, value));
    }

    const searchUpper = value.toUpperCase();
    
    return pipe(
      markets,
      filter((market) => {
        const koreanChoseong = getChoseong(market.koreanName);
        const valueChoseong = getChoseong(value);
        return (
          (koreanChoseong && valueChoseong && koreanChoseong.includes(valueChoseong)) ||
          market.englishName.toUpperCase().includes(searchUpper) ||
          market.code.includes(searchUpper)
        );
      }),
      map((market) => attachHighlightMarket(market, value)),
      sortBy((data) => data.similarScore),
      reverse,
      toArray
    )
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
          <button className={'text-slate-400 hover:text-slate-200 text-sm'} type="button" onClick={() => onSearch(value)}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        {/* 검색 결과 */}
        {isFocused && searchedMarkets.length > 0 && (
          <div className="z-10 flex flex-col w-full max-h-[24rem] gap-2 overflow-y-auto scroll-transparent">
            {searchedMarkets.map((highlightedMarket) => (
              <Item key={highlightedMarket.market.code} highlightedMarket={highlightedMarket} onSelect={onSelect} />
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

const Item = ({ highlightedMarket, onSelect }: { highlightedMarket: MarketWithHighlight, onSelect: (market: CryptoMarket) => void }) => {
  return (
    <div className="flex justify-between items-center w-full px-3 py-2 gap-2 hover:bg-slate-500/20 rounded-lg" onClick={() => onSelect(highlightedMarket.market)}>
      <div className="text-sm text-slate-300">
        {highlightedMarket.koreanHighlights.map((part, index) => (
          <span 
            key={index} 
            className={cn([
              { 'text-indigo-300 font-medium': part.isHighlight === 'half' },
              { 'text-indigo-500 font-medium': part.isHighlight === 'full' }
            ])}
          >
            {part.text}
          </span>
        ))}
      </div>
      <div className="text-xs text-slate-400">
        {highlightedMarket.codeHighlights.map((part, index) => (
          <span 
            key={index} 
            className={cn([
              { 'text-indigo-300 font-medium': part.isHighlight === 'half' },
              { 'text-indigo-500 font-medium': part.isHighlight === 'full' }
            ])}
          >
            {part.text}
          </span>
        ))}
      </div>
    </div>
  );
};
