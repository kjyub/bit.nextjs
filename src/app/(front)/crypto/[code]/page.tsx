import BitServerApi from "@/apis/api/bits/BitServerApi";
import TradeGoServerApi from "@/apis/api/bits/TradeGoServerApi";
import BitMarketCommunity from "@/components/bits/community/BitMarketCommunity";
import BitMarketMain from "@/components/bits/BitMarketMain";
import CryptoFallback from "@/components/fallbacks/CryptoFallback";
import { Suspense } from "react";
import { MARKET_COMMUNITY_PAGE_SIZE } from "@/constants/BitConsts";

export interface IMarketPageSearchParams {
    search: string
    page: number
}

interface IMarketPage {
    params: Promise<{ code: string }>
    searchParams: Promise<IMarketPageSearchParams>
}
export default async function CryptoMarketPage({ params, searchParams }: IMarketPage) {
    const { code } = await params
    const awaitSearchParams = await searchParams
    const { search = "", page = 1 } = awaitSearchParams

    const marketData = await BitServerApi.getMarket(code)
    const marketCurrent = await TradeGoServerApi.getMarketCurrent(code)

    const communityListData = await BitServerApi.getCommunityList(search, code, page, MARKET_COMMUNITY_PAGE_SIZE)

    return (
        <BitMarketMain 
            marketCode={code} 
            marketData={marketData} 
            marketCurrent={marketCurrent} 
            communityNode={
                <Suspense fallback={<CryptoFallback />}>
                    <BitMarketCommunity 
                        marketCode={code}
                        params={awaitSearchParams}
                        communityListData={communityListData}
                    />
                </Suspense>
            }
        />
    )
}