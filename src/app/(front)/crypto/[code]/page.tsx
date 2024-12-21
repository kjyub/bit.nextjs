import CryptoServerApi from "@/apis/api/cryptos/CryptoServerApi";
import TradeGoServerApi from "@/apis/api/cryptos/TradeGoServerApi";
import CryptoMarketCommunity from "@/components/cryptos/community/CryptoMarketCommunity";
import CryptoMarketMain from "@/components/cryptos/CryptoMarketMain";
import CryptoFallback from "@/components/fallbacks/CryptoFallback";
import { Suspense } from "react";
import { MARKET_COMMUNITY_PAGE_SIZE } from "@/constants/CryptoConsts";

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

    const marketData = await CryptoServerApi.getMarket(code)
    const marketCurrent = await TradeGoServerApi.getMarketCurrent(code)

    const communityListData = await CryptoServerApi.getCommunityList(search, code, page, MARKET_COMMUNITY_PAGE_SIZE)

    return (
        <CryptoMarketMain 
            marketCode={code} 
            marketData={marketData} 
            marketCurrent={marketCurrent} 
            communityNode={
                <Suspense fallback={<CryptoFallback />}>
                    <CryptoMarketCommunity 
                        marketCode={code}
                        params={awaitSearchParams}
                        communityListData={communityListData}
                    />
                </Suspense>
            }
        />
    )
}