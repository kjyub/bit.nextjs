'use client';

import KakaoContainer from '@/layouts/KakaoContainer';
import * as SS from '@/styles/SignupStyles';
import AuthUtils from '@/utils/AuthUtils';
import { useState } from 'react';
import ModalContainer from '../ModalContainer';
import InfoModal from '../commons/InfoModal';
import KakaoIcon from '@/components/svgs/auth/KakaoIcon';
import TermsOfService from './agreements/TermsOfService';
import PrivacyPolicy from './agreements/PrivacyPolicy';

export default function SignupLobby() {
  const [isShowAgreement, setShowAgreement] = useState<boolean>(false);
  const [isShowPrivacy, setShowPrivacy] = useState<boolean>(false);

  const handleKakao = () => {
    AuthUtils.authKakao();
  };

  return (
    <SS.Layout>
      <SS.BoxContainer className="space-y-2">
        <div className="flex flex-col items-center md:w-128">
          <SS.Title>로그인</SS.Title>
        </div>

        <SS.AuthTypeSection>
          {/* <span className="title animate-fade-in">로그인 유형을 선택해주세요</span> */}

          <div className="types animate-fade-in">
            <KakaoContainer>
              <button
                className="bg-kakao-container rounded-xl px-5 py-1 hover:shadow shadow-kakao-container duration-300"
                type="button"
                onClick={() => {
                  handleKakao();
                }}
              >
                <KakaoIcon width={30} height={30} viewBox="0 0 20 20" />
                <span className="pr-1 text-kakao-text">카카오 로그인</span>
              </button>
            </KakaoContainer>
          </div>

          <div className="agreement">
            {'로그인 시 '}
            <button
              type="button"
              onClick={() => {
                setShowAgreement(true);
              }}
            >
              서비스 이용약관
            </button>
            {'및'}
            <button
              type="button"
              onClick={() => {
                setShowPrivacy(true);
              }}
            >
              개인정보 수집 및 이용 동의
            </button>
            {'에 동의하게 됩니다.'}
          </div>
        </SS.AuthTypeSection>
      </SS.BoxContainer>

      <ModalContainer isOpen={isShowAgreement} setIsOpen={setShowAgreement}>
        <InfoModal
          title="서비스 이용약관"
          content={<TermsOfService />}
        />
      </ModalContainer>

      <ModalContainer isOpen={isShowPrivacy} setIsOpen={setShowPrivacy}>
        <InfoModal
          title="개인정보 수집 및 이용 동의"
          content={<PrivacyPolicy />}
        />
      </ModalContainer>
    </SS.Layout>
  );
}
