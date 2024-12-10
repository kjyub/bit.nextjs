import BitServerApi from "@/apis/api/bits/BitServerApi";
import UpbitServerApi from "@/apis/api/bits/UpbitServerApi";
import BitMarketMain from "@/components/bits/BitMarketMain";

interface IMarketPage {
    code: string
}
export default async function CryptoMarketPage({ params }: IMarketPage) {
    const { code } = await params

    const marketData = await BitServerApi.getMarket(code)
    const marketCurrent = await UpbitServerApi.getMarketCurrent(code)

    return (
        <BitMarketMain marketCode={code} marketData={marketData} marketCurrent={marketCurrent} />
    )
}