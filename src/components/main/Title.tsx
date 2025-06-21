import { Suspense } from "react";
import type { IUpbitMarketTicker } from "@/types/cryptos/CryptoInterfaces";
import MarketGrid from "./MarketGrid";

interface Props {
  getMarketsPromise: Promise<IUpbitMarketTicker[]>;
}
export default function Title({ getMarketsPromise }: Props) {

  return (
    <div className="relative flex flex-col w-full max-md:aspect-square md:aspect-video rounded-4xl overflow-hidden">
      <div className="absolute-center z-10 flex flex-col items-center">
        <h1 className="text-6xl font-bold font-sinchon-rhapsody">Kurrito</h1>
        <h2 className="text-xl">가상화폐 모의투자</h2>
      </div>

      <Suspense>
        <MarketGrid getMarketsPromise={getMarketsPromise} />
      </Suspense>
    </div>
  );
}