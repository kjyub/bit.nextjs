'use client';
import CryptoApi from '@/apis/api/cryptos/CryptoApi';
import * as I from '@/components/inputs/UserInputs';
import { CASH_UNIT, CRYPTO_WALLET_UNIT } from '@/constants/CryptoConsts';
import useSystemMessageStore from '@/store/useSystemMessageStore';
import useUserInfoStore from '@/store/useUserInfo';
import * as S from '@/styles/CryptoWalletStyles';
import { TextFormats } from '@/types/CommonTypes';
import { type TransferType, TransferTypes, WalletTransactionTypes } from '@/types/cryptos/CryptoTypes';
import FormatUtils from '@/utils/FormatUtils';
import NumberUtils from '@/utils/NumberUtils';
import { useEffect, useMemo, useState } from 'react';
import ModalLayout from '../atomics/ModalLayout';
import { SlideInput } from '../inputs/TradeInputs';

const TransferSuffix = {
  [TransferTypes.TO_ACCOUNT]: CASH_UNIT,
  [TransferTypes.TO_WALLET]: CRYPTO_WALLET_UNIT,
};

interface CryptoTransferModalProps {
  defaultTransferType: TransferType;
  cash: number;
  balance: number;
  close: () => void;
}
export default function CryptoTransferModal({ defaultTransferType, close }: CryptoTransferModalProps) {
  const createMessage = useSystemMessageStore((state) => state.createMessage);

  // 타입 및 스타일
  const [transferType, setTransferType] = useState<TransferType>(defaultTransferType);

  // 잔액
  const { cash, balance, updateInfo } = useUserInfoStore();

  // 이체 값
  const [value, setValue] = useState<number>(0);
  const percentValue = useMemo(() => {
    const max = transferType === TransferTypes.TO_ACCOUNT ? balance : cash;
    return (value / max) * 100;
  }, [value, transferType]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isValid, setValid] = useState<boolean>(false);

  // 잔액 정보 불러오기
  useEffect(() => {
    updateInfo(false);
  }, []);

  // 이체 값 검증
  useEffect(() => {
    if (transferType === TransferTypes.TO_ACCOUNT) {
      if (value > balance) {
        setErrorMessage('거래 지갑 잔액이 부족합니다.');
        setValid(false);
      } else if (value <= 0) {
        setValid(false);
      } else {
        setErrorMessage('');
        setValid(true);
      }
    } else if (transferType === TransferTypes.TO_WALLET) {
      if (value > cash) {
        setErrorMessage('통장 잔액이 부족합니다.');
        setValid(false);
      } else if (value <= 0) {
        setValid(false);
      } else {
        setErrorMessage('');
        setValid(true);
      }
    }
  }, [value]);

  useEffect(() => {
    setValue(0);
  }, [transferType]);

  const handleSlideValue = (value: number) => {
    const max = transferType === TransferTypes.TO_ACCOUNT ? balance : cash;
    const _value = (value / 100) * max;
    setValue(NumberUtils.roundDecimal(_value, 0));
  };

  const handleTransfer = async () => {
    if (!isValid) return;

    const data = {
      transaction_type:
        transferType === TransferTypes.TO_ACCOUNT ? WalletTransactionTypes.WITHDRAW : WalletTransactionTypes.DEPOSIT,
      amount: NumberUtils.roundDecimal(value, 0),
    };

    const response = await CryptoApi.transactionWallet(data);
    if (response) {
      setValue(0);
      updateInfo();
      createMessage({
        type: 'alert',
        content: '이체가 완료되었습니다.',
      });
      close();
      return;
    } else {
      createMessage({
        type: 'alert',
        content: '이체에 실패하였습니다.',
      });
      return;
    }
  };

  return (
    <ModalLayout title={'환전'} layoutClassName="max-sm:w-[80vw] sm:w-96" contentClassName="max-h-[80vh]">
      <S.TransferTypeBox>
        <button
          type="button"
          className={transferType === TransferTypes.TO_ACCOUNT ? 'active' : ''}
          onClick={() => {
            setTransferType(TransferTypes.TO_ACCOUNT);
          }}
        >
          <span>{'거래 지갑 > 통장'}</span>
          <i className="fa-solid fa-money-check"></i>
        </button>
        <button
          type="button"
          className={transferType === TransferTypes.TO_WALLET ? 'active' : ''}
          onClick={() => {
            setTransferType(TransferTypes.TO_WALLET);
          }}
        >
          <span>{'통장 > 거래 지갑'}</span>
          <i className="fa-brands fa-bitcoin"></i>
        </button>
        <div className={`thumb ${transferType === TransferTypes.TO_WALLET ? 'right' : ''}`} />
        <div className="absolute-center bg" />
      </S.TransferTypeBox>

      <div className="flex flex-col w-full mt-4 space-y-6">
        <I.NumberInput
          label={'이체 금액'}
          value={value}
          setValue={setValue}
          placeholder={'금액을 입력'}
          className="h-10 pl-4 pr-1 text-right"
          suffix={TransferSuffix[transferType]}
          errorMessage={errorMessage}
          min={0}
          max={transferType === TransferTypes.TO_ACCOUNT ? NumberUtils.roundDecimal(balance, 0) : NumberUtils.roundDecimal(cash, 0)}
        />
        <SlideInput value={percentValue} setValue={handleSlideValue} min={0} max={100} step={1} mark={25} />

        {transferType === TransferTypes.TO_ACCOUNT && (
          <S.TransferInfoList>
            <S.TransferInfoBox>
              <span className="label">지갑 잔액</span>
              <span className="value">
                {priceText(balance)}
                {CRYPTO_WALLET_UNIT}
              </span>
            </S.TransferInfoBox>
            <S.TransferInfoBox>
              <span className="label">이체 후 통장 잔액</span>
              <span className="value">
                {priceText(cash + value)}
                {CASH_UNIT}
              </span>
            </S.TransferInfoBox>
          </S.TransferInfoList>
        )}
        {transferType === TransferTypes.TO_WALLET && (
          <S.TransferInfoList>
            <S.TransferInfoBox>
              <span className="label">통장 잔액</span>
              <span className="value">
                {priceText(cash)}
                {CASH_UNIT}
              </span>
            </S.TransferInfoBox>
            <S.TransferInfoBox>
              <span className="label">이체 후 지갑 잔액</span>
              <span className="value">
                {priceText(balance + value)}
                {CRYPTO_WALLET_UNIT}
              </span>
            </S.TransferInfoBox>
          </S.TransferInfoList>
        )}

        <S.TransferButton
          onClick={() => {
            handleTransfer();
          }}
          disabled={!isValid}
        >
          이체하기
        </S.TransferButton>
      </div>
    </ModalLayout>
  );
}

const priceText = (price: number) => {
  return FormatUtils.textFormat(NumberUtils.roundDecimal(price, 0), TextFormats.NUMBER);
};
