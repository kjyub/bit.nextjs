import { useDetectClose } from '@/hooks/useDetectClose';
import * as S from '@/styles/UserInputStyles';
import CommonUtils from '@/utils/CommonUtils';
import React, { useState } from 'react';

interface InputProps {
  type: string;
  label: string;
  labelWidth?: string;
  placeholder?: string;
  helpText?: string;
  autoComplete: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<unknown>>;
  errorMessage?: string;
  suffix?: string;
  setFocus?: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter: () => void;
  disabled: boolean;
  children?: React.ReactNode;
}

const FrontInputContainer: React.FC<InputProps> = ({ label, labelWidth = 'w-[80px]', helpText, children }) => {
  return (
    <S.Layout>
      <div className="flex justify-between items-center w-full">
        {!CommonUtils.isStringNullOrEmpty(label) && (
          <S.Label className={`${!CommonUtils.isStringNullOrEmpty(labelWidth) ? labelWidth : ''}`}>{label}</S.Label>
        )}

        {!CommonUtils.isStringNullOrEmpty(helpText) && <S.HelpText>{helpText}</S.HelpText>}
      </div>
      {children}
    </S.Layout>
  );
};

export const Input: React.FC<InputProps> = ({
  type,
  label,
  labelWidth = 'w-[80px]',
  placeholder,
  helpText,
  autoComplete = false,
  value,
  errorMessage,
  suffix = '',
  onChange,
  onEnter,
  setFocus,
  disabled,
  children,
}) => {
  const [isInputFoucs, setInputFocus] = useState<boolean>(false);

  // 보통 상황에선 값이 있을 때만 유효성 에러 메세지 표시한다.
  const isError = !CommonUtils.isStringNullOrEmpty(value) && !CommonUtils.isStringNullOrEmpty(errorMessage);

  const handleEnter = (e) => {
    if (e.key == 'Enter' && !CommonUtils.isNullOrUndefined(onEnter)) {
      onEnter();
    }
  };

  const handleFocus = (_isFocus: boolean) => {
    if (setFocus) {
      setFocus(_isFocus);
    }
    setInputFocus(_isFocus);
  };

  return (
    <FrontInputContainer label={label} labelWidth={labelWidth} helpText={helpText}>
      <S.InputContainer>
        <S.InputBox $is_active={isInputFoucs} $is_error={isError}>
          <S.Input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            autoComplete={autoComplete ? null : 'new-password'}
            onFocus={() => {
              handleFocus(true);
            }}
            onBlur={() => {
              handleFocus(false);
            }}
            onKeyDown={handleEnter}
            disabled={disabled}
            $is_error={isError}
          />
        </S.InputBox>
        {children}
        {!CommonUtils.isStringNullOrEmpty(suffix) && <S.Suffix>{suffix}</S.Suffix>}
        {isError && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
      </S.InputContainer>
    </FrontInputContainer>
  );
};

interface IBooleanInputProps extends InputProps {
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  yesText: string;
  noText: string;
}
export const BooleanInput: React.FC<IBooleanInputProps> = ({
  label,
  labelWidth = 'w-[80px]',
  value,
  setValue,
  yesText = '예',
  noText = '아니요',
}) => {
  return (
    <FrontInputContainer label={label} labelWidth={labelWidth}>
      <S.InputContainer>
        <S.BoolInput>
          <S.BoolButton
            $is_active={value === true}
            onClick={() => {
              setValue(true);
            }}
          >
            {yesText}
          </S.BoolButton>
          <S.BoolButton
            $is_active={value === false}
            onClick={() => {
              setValue(false);
            }}
          >
            {noText}
          </S.BoolButton>
        </S.BoolInput>
      </S.InputContainer>
    </FrontInputContainer>
  );
};

interface IComboInputProps extends InputProps {
  optionKeys: string[];
  optionNames: string[];
}
export const Combo: React.FC<IComboInputProps> = ({
  type,
  label,
  labelWidth = 'w-[80px]',
  placeholder,
  helpText,
  optionKeys,
  optionNames,
  value,
  setValue,
  errorMessage,
}) => {
  // 보통 상황에선 값이 있을 때만 유효성 에러 메세지 표시한다.
  const isError = !CommonUtils.isStringNullOrEmpty(value) && !CommonUtils.isStringNullOrEmpty(errorMessage);

  const [optionRef, isOptionShow, setOptionShow] = useDetectClose();

  // 값이 선택되었는지 여부
  const isSelected = !(CommonUtils.isStringNullOrEmpty(value) || value < 0);

  return (
    <FrontInputContainer label={label} labelWidth={labelWidth} helpText={helpText}>
      <S.InputContainer ref={optionRef}>
        <S.InputBox
          type={type}
          onClick={() => {
            setOptionShow(!isOptionShow);
          }}
          $is_active={isOptionShow}
          $is_error={isError}
        >
          <span className={`${isSelected ? 'active' : ''}`}>{isSelected ? optionNames[value] : placeholder}</span>
          <i className="fa-solid fa-chevron-down"></i>
        </S.InputBox>

        {isOptionShow && (
          <S.OptionBox>
            {optionKeys.map((key, index) => (
              <option
                key={key}
                onClick={() => {
                  setValue(key);
                  setOptionShow(false);
                }}
              >
                {optionNames[index]}
              </option>
            ))}
          </S.OptionBox>
        )}
        {isError && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
      </S.InputContainer>
    </FrontInputContainer>
  );
};

interface ICheckbox extends IUserInputText {
  value: string;
  setValue: Dispatch<SetStateAction<boolean>>;
  label: string;
  disabled: boolean;
}
export const Checkbox = ({ value, setValue, label = '', disabled = false }: ICheckbox) => {
  return (
    <div
      className="flex items-center space-x-0.5 cursor-pointer"
      onClick={() => {
        if (disabled) {
          return;
        }
        setValue(!value);
      }}
    >
      {value ? <i className="fa-solid fa-square-check"></i> : <i className="fa-regular fa-square"></i>}

      <span className="text-sm text-brand_gray-7">{label}</span>
    </div>
  );
};
