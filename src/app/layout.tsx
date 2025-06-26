import type { Metadata, Viewport } from 'next';
import '@/styles/css/globals.css';
import { setAuthToken } from '@/apis/utils/instances';
import AppClientLayout from '@/layouts/AppClientLayout';
import { AuthProvider } from '@/store/providers/AuthProvider';
import { UiProvider } from '@/store/providers/UiProvider';
import AuthServerUtils from '@/utils/AuthUtils.server';
import Script from 'next/script';
import { pretendard, sinchonRhapsody } from './fonts';
import UserServerApi from '@/apis/api/users/UserServerApi';
import { v4 as uuidv4 } from 'uuid';

export const metadata: Metadata = {
  title: {
    default: 'Kurrito | 가상화폐 모의투자',
    template: '%s | Kurrito',
  },
  description: 'Kurrito는 가상화폐 모의투자 게임입니다. 가상화폐 시장을 모의로 투자해보세요!',
  openGraph: {
    type: 'website',
    title: 'Kurrito | 가상화폐 모의투자',
    siteName: 'Kurrito',
    description: 'Kurrito는 가상화폐 모의투자 게임입니다. 가상화폐 시장을 모의로 투자해보세요!',
    url: 'https://kurrito.kr/',
  },
  twitter: {
    title: 'Kurrito | 가상화폐 모의투자',
    card: 'summary_large_image',
    description: 'Kurrito는 가상화폐 모의투자 게임입니다. 가상화폐 시장을 모의로 투자해보세요!',
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authToken = await AuthServerUtils.getAuthToken();
  setAuthToken(authToken);

  const instanceOptions = await AuthServerUtils.getAuthInstanceOptions();
  const userData = authToken ? await UserServerApi.getUserCurrentData(instanceOptions) : {};

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <FrontHead />
      </head>
      <body className={`${pretendard.variable} ${sinchonRhapsody.variable}`}>
        <AuthProvider authToken={authToken} userData={userData}>
          <UiProvider>
            <AppClientLayout />
            {children}
          </UiProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

const FrontHead = () => {
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />

      {/* 카카오 auth api */}
      <Script
        async
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
        integrity="sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4"
        crossOrigin="anonymous"
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
            const chartColor = localStorage.getItem('chart_color');
            if (chartColor === 'red-blue') {
              document.documentElement.style.setProperty('--color-position-long-1', '#ad2c2c');
              document.documentElement.style.setProperty('--color-position-long-2', '#c43a3a');
              document.documentElement.style.setProperty('--color-position-long-3', '#d74848');
              document.documentElement.style.setProperty('--color-position-long-strong', 'oklch(0.637 0.237 25.331)');

              document.documentElement.style.setProperty('--color-position-short-1', '#2d5ab9');
              document.documentElement.style.setProperty('--color-position-short-2', '#3b69cb');
              document.documentElement.style.setProperty('--color-position-short-3', '#4978dd');
              document.documentElement.style.setProperty('--color-position-short-strong', 'oklch(0.623 0.214 259.815)');
            } else if (chartColor === 'green-red') {
              document.documentElement.style.setProperty('--color-position-long-1', '#2db95a');
              document.documentElement.style.setProperty('--color-position-long-2', '#3bcb69');
              document.documentElement.style.setProperty('--color-position-long-3', '#49dd78');
              document.documentElement.style.setProperty('--color-position-long-strong', 'oklch(0.623 0.214 145)');

              document.documentElement.style.setProperty('--color-position-short-1', '#ad2c2c');
              document.documentElement.style.setProperty('--color-position-short-2', '#c43a3a');
              document.documentElement.style.setProperty('--color-position-short-3', '#d74848');
              document.documentElement.style.setProperty('--color-position-short-strong', 'oklch(0.637 0.237 25.331)');
            }
          })();
        `,
        }}
      />
    </>
  );
};

export const viewport: Viewport = {
  themeColor: '#010018',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
