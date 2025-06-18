import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@/styles/css/globals.css';
import UserApi from '@/apis/api/users/UserApi';
import { setAuthToken } from '@/apis/utils/instances';
import AppClientLayout from '@/layouts/AppClientLayout';
import { AuthProvider } from '@/store/providers/AuthProvider';
import AuthServerUtils from '@/utils/AuthUtils.server';
import Script from 'next/script';
import { pretendard, sinchonRhapsody } from './fonts';
import { UiProvider } from '@/store/providers/UiProvider';

export const metadata: Metadata = {
  title: 'Bits',
  description: '빗스',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authToken = await AuthServerUtils.getAuthToken();
  setAuthToken(authToken);

  const userData = authToken ? await UserApi.getUserDataSelf() : {};

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <FrontHead />
      </head>
      <body className={`${pretendard.variable} ${sinchonRhapsody.variable}`}>
        <UiProvider>
          <AuthProvider authToken={authToken} userData={userData}>
            <AppClientLayout />
            {children}
          </AuthProvider>
        </UiProvider>
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

      <script dangerouslySetInnerHTML={{
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
        `
      }} />
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
