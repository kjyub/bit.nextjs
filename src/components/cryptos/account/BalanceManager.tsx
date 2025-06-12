'use client';

import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoWalletStyles';
import { Position } from '../mytrade/MyTradePosition';
import PositionAll from './PositionAll';
import PositionStackContainer from './PositionStackContainer';

export default function BalanceManager() {
  const { balance, myTrades, isLoading } = useUserInfoStore();

  const { positions } = myTrades;

  return (
    <S.WalletLayout className="md:h-[calc(100vh-28rem)] max-md:mb-28">
      <span className="title">투자 내역</span>

      <PositionAll positions={positions} balance={balance} isLoading={isLoading} />

      <PositionStackContainer positions={positions} balance={balance} isLoading={isLoading} />

      {/* 가격 정보 차트 */}
      <div className="max-md:static md:relative flex-1 md:h-full">
        <div className="max-md:static md:absolute flex flex-col w-full h-full gap-2 overflow-y-scroll scroll-transparent [&_.close-box]:hidden">
          {positions.map((position, index) => (
            <Position key={index} position={position} userBudget={balance} />
          ))}
        </div>
      </div>
    </S.WalletLayout>
  );
}
