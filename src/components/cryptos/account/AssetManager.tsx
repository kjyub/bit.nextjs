'use client';

import ModalContainer from '@/components/ModalContainer';
import { CASH_UNIT, CRYPTO_WALLET_UNIT } from '@/constants/CryptoConsts';
import useSystemMessageStore from '@/store/useSystemMessageStore';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoWalletStyles';
import { TextFormats } from '@/types/CommonTypes';
import { type TransferType, TransferTypes } from '@/types/cryptos/CryptoTypes';
import FormatUtils from '@/utils/FormatUtils';
import { useEffect, useMemo, useState } from 'react';
import CryptoTransferModal from '../CryptoTransferModal';
import { Button } from '@/components/atomics/buttons/Button/Button';

export default function AssetManager() {
  const [isTransferModalOpen, setTransferModalOpen] = useState<boolean>(false);
  const [transferType, setTransferType] = useState<TransferType>(TransferTypes.TO_WALLET);

  const { cash, balance, locked, updateInfo, isAuth, isLoading } = useUserInfoStore();
  const createSystemMessage = useSystemMessageStore((state) => state.createMessage);

  useEffect(() => {
    if (isAuth) {
      updateInfo();
    }
  }, [isAuth]);

  const handleTransferModal = (type: TransferType) => {
    setTransferType(type);
    setTransferModalOpen(true);
  };

  const availableBalance = useMemo(() => {
    const a = balance - locked;

    return a < 0 ? 0 : a;
  }, [balance, locked]);

  return (
    <S.WalletLayout>
      <span className="title">자산</span>
      <div className="grid max-sm:grid-cols-1 sm:grid-cols-2 gap-8 w-full">
        <S.WalletBox>
          <div className="header">
            <div className="title">
              <i className="fa-solid fa-money-check"></i>
              <span>내 통장</span>
            </div>
            <Button
              size="sm"
              onClick={() => {
                handleTransferModal(TransferTypes.TO_ACCOUNT);
              }}
              className="space-x-1 [&>i]:text-xs"
            >
              <span>거래 지갑</span>
              <i className="fa-solid fa-arrow-right"></i>
              <span>통장</span>
            </Button>
          </div>
          <div className="content">
            <div className="label">총 잔액</div>
            <div className={`value space-x-1 ${isLoading ? 'skeleton w-24' : ''}`}>
              <span>{FormatUtils.textFormat(cash, TextFormats.NUMBER)}</span>
              <span>{CASH_UNIT}</span>
            </div>
          </div>
        </S.WalletBox>
        <S.WalletBox>
          <div className="header">
            <div className="title">
              <i className="fa-brands fa-bitcoin"></i>
              <span>내 거래 지갑</span>
            </div>
            <Button
              size="sm"
              onClick={() => {
                handleTransferModal(TransferTypes.TO_WALLET);
              }}
              className="space-x-1 [&>i]:text-xs"
            >
              <span>통장</span>
              <i className="fa-solid fa-arrow-right"></i>
              <span>거래 지갑</span>
            </Button>
          </div>
          <div className="content">
            <div className="label">지갑 총액</div>
            <div className={`value space-x-1 ${isLoading ? 'skeleton w-24' : ''}`}>
              <span>{FormatUtils.textFormat(Math.floor(balance), TextFormats.NUMBER)}</span>
              <span>{CRYPTO_WALLET_UNIT}</span>
            </div>
          </div>
          <div className="content">
            <div className="label">사용 중</div>
            <div className={`value space-x-1 ${isLoading ? 'skeleton w-24' : ''}`}>
              <span>{FormatUtils.textFormat(Math.floor(locked), TextFormats.NUMBER)}</span>
              <span>{CRYPTO_WALLET_UNIT}</span>
            </div>
          </div>
          <div className="content">
            <div className="label">사용 가능</div>
            <div className={`value space-x-1 ${isLoading ? 'skeleton w-24' : ''}`}>
              <span>{FormatUtils.textFormat(Math.floor(availableBalance), TextFormats.NUMBER)}</span>
              <span>{CRYPTO_WALLET_UNIT}</span>
            </div>
          </div>
        </S.WalletBox>
      </div>

      <ModalContainer isOpen={isTransferModalOpen} setIsOpen={setTransferModalOpen}>
        <CryptoTransferModal
          defaultTransferType={transferType}
          cash={cash}
          balance={balance}
          close={() => {
            setTransferModalOpen(false);
          }}
        />
      </ModalContainer>
    </S.WalletLayout>
  );
}
