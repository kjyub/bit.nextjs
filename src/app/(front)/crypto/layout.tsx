import CryptoClientLayout from '@/components/cryptos/CryptoClientLayout';
import { CryptoMobileNavigation, CryptoNavigation } from '@/components/cryptos/CryptoNavigation';
import CryptoMarketList from '@/components/cryptos/market-list/MarketList';
import CryptoMarketListWrapper from '@/components/cryptos/market-list/MarketListWrapper';
import { CryptoProvider } from '@/store/providers/CryptoProvider';
import * as S from '@/styles/CryptoMarketStyles';
import * as MS from '@/styles/MainStyles';
import { Suspense } from 'react';

export async function generateMetadata() {
  return {
    title: '암호화폐 내역',
  };
}

export default function CryptoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <CryptoProvider>
      <MS.PageLayout>
        <CryptoClientLayout>
          <Suspense>
            <CryptoNavigation />
            <CryptoMobileNavigation />
          </Suspense>

          <div className="flex justify-center w-full">
            {children}

            <CryptoMarketListWrapper>
              <S.MarketListLayout>
                <CryptoMarketList />
              </S.MarketListLayout>
            </CryptoMarketListWrapper>
          </div>
        </CryptoClientLayout>
      </MS.PageLayout>
    </CryptoProvider>
  );
}
