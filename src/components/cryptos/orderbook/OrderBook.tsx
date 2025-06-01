import { IUpbitMarketTicker, IUpbitOrderBook, IUpbitOrderBookUnit } from "@/types/cryptos/CryptoInterfaces";
import * as S from './OrderBookStyle';
import { useMemo, useRef, useEffect, useState } from "react";
import { cn } from "@/utils/StyleUtils";
import { useParams } from "next/navigation";
import CryptoUtils from "@/utils/CryptoUtils";
import CommonUtils from "@/utils/CommonUtils";
import { TextFormats } from "@/types/CommonTypes";
import useMarketPriceStore from "@/store/useMarketPriceStore";
import { PriceChangeTypes } from "@/types/cryptos/CryptoTypes";
import { useCryptoMarketTrade } from "@/hooks/useCryptoMarketTrade";

interface Unit {
  price: number;
  size: number;
}

interface IOrderBook {
  orderBook: IUpbitOrderBook;
  marketCode: string;
  marketCurrent: IUpbitMarketTicker;
}
export default function OrderBook({ orderBook, marketCode, marketCurrent }: IOrderBook) {
  const socketData = useMarketPriceStore((state) => state.marketDic[marketCode]);

  const { price } = useMemo(() => {
    if (!socketData) {
      return {
        price: marketCurrent.trade_price,
      };
    }
    return {
      price: socketData.trade_price,
    };
  }, [socketData]);

  const riseUnits: Unit[] = useMemo(() => {
    return orderBook.orderbook_units.map((unit) => ({
      price: unit.ask_price,
      size: unit.ask_size,
    })).toReversed();
  }, [orderBook]);

  const fallUnits: Unit[] = useMemo(() => {
    return orderBook.orderbook_units.map((unit) => ({
      price: unit.bid_price,
      size: unit.bid_size,
    }));
  }, [orderBook]);

  return (
    <div className="flex flex-col w-full h-[calc(100%-2rem)]">
      <S.Row className="h-9 shrink-0 pr-2 text-sm font-light text-slate-400 max-sm:hidden">
        <span className="trade-price">가격</span>
        <span className="price">수량</span>
        <span className="size">총액</span>
      </S.Row>

      <List>
        {riseUnits.map((unit, index) => (
          <Row 
            key={index}
            unit={unit}
            max={orderBook.total_ask_size}
            className="[&_.trade-price]:text-red-500 [&_.percent]:bg-red-500/50"
            isAsk={true}
          />
        ))}

        <Price price={price} />
        
        {fallUnits.map((unit, index) => (
          <Row
            key={index}
            unit={unit}
            max={orderBook.total_bid_size}
            className="[&_.trade-price]:text-blue-500 [&_.percent]:bg-blue-500/50"
            isAsk={false}
          />
        ))}
      </List>
    </div>
  );
}

const List = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  // 화면 초기화 시 마다 스크롤 위치 중앙 위치
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTop = (scrollHeight - clientHeight) / 2;
    }
  }, [params]);

  return (
    <div ref={scrollRef} className="flex flex-col w-full flex-1 max-md:py-16 overflow-y-auto scroll-transparent">
      {children}
    </div>
  )
}

const Price = ({ price }: { price: number }) => {
  const [changeType, setChangeType] = useState<PriceChangeTypeValues>(PriceChangeTypes.EVEN);
  const [oldPrice, setOldPrice] = useState<number>(price);

  const { setTradePrice } = useCryptoMarketTrade();

  useEffect(() => {
    setChangeType(CryptoUtils.getPriceChangeType(price, oldPrice));
    setOldPrice(price);
  }, [price]);

  return (
    <div 
      className="flex items-center w-full py-2 gap-2 cursor-pointer"
      onClick={() => setTradePrice(price)}
    >
      <span 
        className={cn(['trade-price', changeType === PriceChangeTypes.EVEN ? 'text-slate-400' : changeType === PriceChangeTypes.RISE ? 'text-red-500' : 'text-blue-500'])}
      >
        {CryptoUtils.getPriceText(price)}
      </span>

      <div className="text-sm">
        {changeType === PriceChangeTypes.RISE && <i className="fa-solid fa-arrow-up text-red-500"></i>}
        {changeType === PriceChangeTypes.FALL && <i className="fa-solid fa-arrow-down text-blue-500"></i>}
      </div>
    </div>
  )
}

const Row = ({ unit, max, className }: { unit: Unit, max: number, className: string }) => {
  const { setTradePrice } = useCryptoMarketTrade();

  return (
    <S.Row 
      className={cn(['relative py-1 text-xs hover:bg-slate-100/10 cursor-pointer', className])}
      onClick={() => setTradePrice(unit.price)}
    >
      {/* <span className="trade-price">{(unit.bid_price + unit.ask_price) / 2}</span> */}
      <span className="trade-price">{CryptoUtils.getPriceText(unit.price)}</span>
      <div className="flex max-sm:flex-col max-sm:w-[50px] sm:w-[100px] [&>span]:text-right">
        <span className="size font-light text-slate-200/90">
          {unit.size >= 1000 ? 
            CommonUtils.textFormat(CryptoUtils.getPriceRound(unit.size), TextFormats.KOREAN_PRICE_SIMPLE) : 
            CryptoUtils.getPriceRound(unit.size)
          }
        </span>
        <span className="price font-light text-slate-200/90 max-sm:hidden">
          {unit.size * unit.price >= 1000 ? 
            CommonUtils.textFormat(CryptoUtils.getPriceRound(unit.size * unit.price), TextFormats.KOREAN_PRICE_SIMPLE) :
            CryptoUtils.getPriceRound(unit.size * unit.price)
          }
        </span>
      </div>

      <div className="absolute inset-0 -z-10 flex justify-end size-full">
        <div className="percent h-full" style={{ width: `${(unit.size / max) * 100}%` }} />
      </div>
    </S.Row>
  );
};

// 55400 ~ 58850