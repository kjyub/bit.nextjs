import { CryptoMobileNavigation, CryptoNavigation } from '@/components/cryptos/CryptoNavigation';
import CryptoMarketList from '@/components/cryptos/market-list/MarketList';
import MarketListLayout from '@/components/cryptos/market-list/MarketListLayout';
import { getLayoutModeByPathname } from '@/constants/RouteConfig';
import { CryptoProvider } from '@/store/providers/CryptoProvider';
import * as MS from '@/styles/MainStyles';
import { headers } from 'next/headers';

export async function generateMetadata() {
  return {
    title: '암호화폐 내역',
  };
}

export default async function CryptoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';
  const layoutMode = getLayoutModeByPathname(pathname);

  return (
    <CryptoProvider defaultLayoutMode={layoutMode}>
      <MS.PageLayout className="relative flex flex-col justify-center xl:w-fit mx-auto">
        <CryptoNavigation />
        <CryptoMobileNavigation />

        <div className="flex justify-center w-full">
          {children}

          <MarketListLayout>
            <CryptoMarketList />
          </MarketListLayout>
        </div>
      </MS.PageLayout>
    </CryptoProvider>
  );
}
