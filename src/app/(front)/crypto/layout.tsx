import BitNavigation from "@/components/bits/BitNavigation"
import * as MS from "@/styles/MainStyles"
import * as S from "@/styles/BitMarketStyles"
import BitMarketList from "@/components/bits/BitMarketList"
import MarketPriceLayout from "@/layouts/MarketPriceLayout"
import { Suspense } from "react"
import CryptoFallback from "@/components/fallbacks/CryptoFallback"

export default function BitLayout({ children }: Readonly<{children: React.ReactNode}>) {
    return (
        <MS.PageLayout>
            <MarketPriceLayout />
            <S.Layout>
                <S.InfoLayout>
                    <Suspense fallback={<CryptoFallback />}>
                        {children}
                    </Suspense>
                </S.InfoLayout>

                <S.MarketListLayout>
                    <div className="py-2 border-b border-slate-600/50">
                        <BitNavigation />
                    </div>
                    
                    <BitMarketList />
                </S.MarketListLayout>
            </S.Layout>
        </MS.PageLayout>
    )
}