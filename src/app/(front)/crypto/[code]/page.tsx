import BitServerApi from "@/apis/api/bits/BitServerApi";
import TradeGoServerApi from "@/apis/api/bits/TradeGoServerApi";
import BitMarketMain from "@/components/bits/BitMarketMain";
import CryptoFallback from "@/components/fallbacks/CryptoFallback";
import { Suspense } from "react";

interface IMarketPage {
    code: string
}
export default async function CryptoMarketPage({ params }: IMarketPage) {
    const { code } = await params

    const marketData = await BitServerApi.getMarket(code)
    const marketCurrent = await TradeGoServerApi.getMarketCurrent(code)

    return (
        <BitMarketMain marketCode={code} marketData={marketData} marketCurrent={marketCurrent} />
    )
}