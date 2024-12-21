import CryptoNavigation from "@/components/cryptos/CryptoNavigation"
import * as MS from "@/styles/MainStyles"
import * as S from "@/styles/CryptoMarketStyles"
import CryptoMarketList from "@/components/cryptos/CryptoMarketList"
import MarketPriceLayout from "@/layouts/MarketPriceLayout"
import { Suspense } from "react"
import CryptoFallback from "@/components/fallbacks/CryptoFallback"

export default function CryptoLayout({ children }: Readonly<{children: React.ReactNode}>) {
    return (
        <MS.PageLayout>
            <MarketPriceLayout />
            <S.Layout>
                <Suspense fallback={<CryptoFallback />}>
                    {children}
                </Suspense>

                <S.MarketListLayout>
                    <div className="py-2 border-b border-slate-600/50">
                        <CryptoNavigation />
                    </div>
                    
                    <CryptoMarketList />
                </S.MarketListLayout>
            </S.Layout>
        </MS.PageLayout>
    )
}