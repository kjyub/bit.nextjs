import * as S from '@/styles/CryptoWalletStyles';
import AssetManager from './account/AssetManager';
import BalanceManager from './account/BalanceManager';

export default function CryptoMain() {
  return (
    <S.Layout className="pt-8">
      <AssetManager />
      <BalanceManager />
    </S.Layout>
  );
}
