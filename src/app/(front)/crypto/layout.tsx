import CryptoMarketList from '@/components/cryptos/market-list/CryptoMarketList';
import CryptoMarketListWrapper from '@/components/cryptos/market-list/CryptoMarketListWrapper';
import CryptoNavigation from '@/components/cryptos/CryptoNavigation';
import CryptoFallback from '@/components/fallbacks/CryptoFallback';
import CryptoClientLayout from '@/layouts/CryptoClientLayout';
import * as S from '@/styles/CryptoMarketStyles';
import * as MS from '@/styles/MainStyles';
import { Suspense } from 'react';

export default function CryptoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <MS.PageLayout>
      <div className="flex flex-col justify-center">
        <div className="flex w-full pb-2 mt-4 border-b border-slate-600/50">
          <Suspense>
            <CryptoNavigation />
          </Suspense>
        </div>

        <div className="flex justify-center">
          <Suspense fallback={<CryptoFallback />}>{children}</Suspense>

          <CryptoMarketListWrapper>
            <S.MarketListLayout>
              <CryptoMarketList />
            </S.MarketListLayout>
          </CryptoMarketListWrapper>
        </div>
      </div>

      <CryptoClientLayout />
    </MS.PageLayout>
  );
}
