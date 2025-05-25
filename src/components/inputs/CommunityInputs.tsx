import * as S from "@/styles/CommunityInputStyles";
import CommonUtils from "@/utils/CommonUtils";
import React, { useState } from "react";

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
  setFocus?: React.Dispatch<React.SetStateAction<boolean>>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter: () => void;
  disabled: boolean;
  children?: React.ReactNode;
}

export const TitleInput = ({ label, value, setValue }: InputProps) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const isLabelActive = isFocus || value;

  return (
    <S.TitleBox>
      <label className={`${isLabelActive ? "active" : ""} ${isFocus ? "focus" : ""}`}>{label}</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
    </S.TitleBox>
  );
};

export const ContentInput = ({ placeholder, value, setValue }: InputProps) => {
  return (
    <S.ContentTextArea
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onInput={(e) => {
        e.target.style.height = "48px";
        e.target.style.height = Number(e.target.scrollHeight) + "px";
      }}
    />
  );
};
