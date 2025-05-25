'use client';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoWalletStyles';
import { TextFormats } from '@/types/CommonTypes';
import { TransferTypeValues, TransferTypes } from '@/types/cryptos/CryptoTypes';
import CommonUtils from '@/utils/CommonUtils';
import { useEffect, useMemo, useState } from 'react';
import ModalContainer from '../ModalContainer';
import CommonButton from '../atomics/buttons/CommonButton';
import CryptoTransferModal from './CryptoTransferModal';

export default function CryptoMain() {
  const [isTransferModalOpen, setTransferModalOpen] = useState<boolean>(false);
  const [transferType, setTransferType] = useState<TransferTypeValues>(TransferTypes.TO_WALLET);

  const { cash, balance, locked, updateInfo } = useUserInfoStore();

  useEffect(() => {
    updateInfo();
  }, []);

  const handleTransferModal = (type: TransferTypeValues) => {
    setTransferType(type);
    setTransferModalOpen(true);
  };

  const availableBalance = useMemo(() => {
    const a = balance - locked;

    return a < 0 ? 0 : a;
  }, [balance, locked]);

  return (
    <S.Layout>
      <S.WalletLayout>
        <div className="grid grid-cols-2 gap-4 w-full">
          <S.WalletBox>
            <div className="header">
              <div className="title">내 통장</div>
              <CommonButton
                onClick={() => {
                  handleTransferModal(TransferTypes.TO_ACCOUNT);
                }}
                className="space-x-1 [&>i]:text-xs"
              >
                <span>거래 지갑</span>
                <i className="fa-solid fa-arrow-right"></i>
                <span>통장</span>
              </CommonButton>
            </div>
            <div className="content">
              <div className="label">총 잔액</div>
              <div className="value">{CommonUtils.textFormat(cash, TextFormats.NUMBER)}W</div>
            </div>
          </S.WalletBox>
          <S.WalletBox>
            <div className="header">
              <div className="title">내 거래 지갑</div>
              <CommonButton
                onClick={() => {
                  handleTransferModal(TransferTypes.TO_WALLET);
                }}
                className="space-x-1 [&>i]:text-xs"
              >
                <span>통장</span>
                <i className="fa-solid fa-arrow-right"></i>
                <span>거래 지갑</span>
              </CommonButton>
            </div>
            <div className="content">
              <div className="label">지갑 총액</div>
              <div className="value">{CommonUtils.textFormat(Math.floor(balance), TextFormats.NUMBER)}C</div>
            </div>
            <div className="content">
              <div className="label">사용 중</div>
              <div className="value">{CommonUtils.textFormat(Math.floor(locked), TextFormats.NUMBER)}C</div>
            </div>
            <div className="content">
              <div className="label">사용 가능</div>
              <div className="value">{CommonUtils.textFormat(Math.floor(availableBalance), TextFormats.NUMBER)}C</div>
            </div>
          </S.WalletBox>
        </div>
      </S.WalletLayout>

      <ModalContainer isOpen={isTransferModalOpen} setIsOpen={setTransferModalOpen}>
        <CryptoTransferModal defaultTransferType={transferType} cash={cash} balance={balance} />
      </ModalContainer>
    </S.Layout>
  );
}
