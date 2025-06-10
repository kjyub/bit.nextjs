import * as S from '@/styles/CryptoWalletStyles';
import AssetManager from './account/AssetManager';
import BalanceManager from './account/BalanceManager';

export default function CryptoMain() {
  return (
    <S.Layout className="max-md:pt-4 md:pt-8">
      <AssetManager />
      <BalanceManager />
    </S.Layout>
  );
}
