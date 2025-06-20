import { useDetectClose } from '@/hooks/useDetectClose';
import * as S from '@/styles/UserInputStyles';
import type React from 'react';
import { useState } from 'react';

interface InputContainerProps {
  label?: string;
  labelWidth?: string;
  helpText?: string;
  children?: React.ReactNode;
}
interface InputBaseProps<T> extends InputContainerProps {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
}

const InputContainer: React.FC<InputContainerProps> = ({ label, labelWidth = 'w-[80px]', helpText, children }) => {
  return (
    <S.Layout>
      <div className="flex justify-between items-center w-full">
        {label && <S.Label className={`${labelWidth ? labelWidth : ''}`}>{label}</S.Label>}

        {helpText && <S.HelpText>{helpText}</S.HelpText>}
      </div>
      {children}
    </S.Layout>
  );
};

interface InputProps<T>
  extends Omit<InputBaseProps<T>, 'value' | 'setValue'>,
    React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  setValue?: React.Dispatch<React.SetStateAction<T>>;
  placeholder?: string;
  errorMessage?: string;
  suffix?: string;
  setFocus?: React.Dispatch<React.SetStateAction<boolean>>;
  onEnter?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const Input: React.FC<InputProps<string | number>> = ({
  type,
  label,
  labelWidth = 'w-[80px]',
  helpText,
  placeholder,
  value,
  setValue,
  errorMessage,
  suffix = '',
  onEnter,
  className,
  children,
  ...props
}) => {
  const [isInputFoucs, setInputFocus] = useState<boolean>(false);

  // 보통 상황에선 값이 있을 때만 유효성 에러 메세지 표시한다.
  const isError = !!(value && errorMessage);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
    <InputContainer label={label} labelWidth={labelWidth} helpText={helpText}>
      <S.InputContainer>
        <S.InputBox $is_active={isInputFoucs} $is_error={!!isError} $disabled={props?.disabled}>
          <S.Input
            type={type}
            value={value}
            className={className}
            placeholder={placeholder}
            onChange={(e) => {
              setValue?.(e.target.value);
              props?.onChange?.(e);
            }}
            autoComplete={props?.autoComplete ? undefined : 'new-password'}
            onKeyDown={handleEnter}
            onFocus={(e) => {
              setInputFocus(true);
              props?.onFocus?.(e);
            }}
            onBlur={(e) => {
              setInputFocus(false);
              props?.onBlur?.(e);
            }}
            {...props}
          />
          {suffix && <S.Suffix>{suffix}</S.Suffix>}
        </S.InputBox>
        {children}
        {isError && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
      </S.InputContainer>
    </InputContainer>
  );
};

interface IBooleanInputProps extends InputBaseProps<boolean> {
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
    <InputContainer label={label} labelWidth={labelWidth}>
      <S.InputContainer>
        <S.BoolInput>
          <S.BoolButton
            $is_active={!!value}
            onClick={() => {
              setValue(true);
            }}
          >
            {yesText}
          </S.BoolButton>
          <S.BoolButton
            $is_active={!value}
            onClick={() => {
              setValue(false);
            }}
          >
            {noText}
          </S.BoolButton>
        </S.BoolInput>
      </S.InputContainer>
    </InputContainer>
  );
};

interface IComboInputProps extends InputBaseProps<string | number> {
  placeholder?: string;
  optionKeys: string[];
  optionNames: string[];
}
export const Combo: React.FC<IComboInputProps> = ({
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
  const isError = !!(value && errorMessage);

  const [optionRef, isOptionShow, setOptionShow] = useDetectClose<HTMLDivElement>();

  // 값이 선택되었는지 여부
  const isSelected = value;

  return (
    <InputContainer label={label} labelWidth={labelWidth} helpText={helpText}>
      <S.InputContainer ref={optionRef}>
        <S.InputBox
          onClick={() => {
            setOptionShow(!isOptionShow);
          }}
          $is_active={isOptionShow}
          $is_error={!!isError}
        >
          <span className={`${isSelected ? 'active' : ''}`}>
            {isSelected ? optionNames[Number(value)] : placeholder}
          </span>
          <i className="fa-solid fa-chevron-down"></i>
        </S.InputBox>

        {isOptionShow && (
          <S.OptionBox>
            {optionKeys.map((key, index) => (
              <li
                key={key}
                onClick={() => {
                  setValue(key);
                  setOptionShow(false);
                }}
              >
                {optionNames[index]}
              </li>
            ))}
          </S.OptionBox>
        )}
        {isError && <S.ErrorMessage>{errorMessage}</S.ErrorMessage>}
      </S.InputContainer>
    </InputContainer>
  );
};

interface ICheckbox extends InputBaseProps<boolean> {
  label: string;
}
export const Checkbox: React.FC<ICheckbox> = ({ value, setValue, label = '', disabled = false }) => {
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
