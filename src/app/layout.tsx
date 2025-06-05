import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '@/styles/css/globals.css';
import UserApi from '@/apis/api/users/UserApi';
import { setAuthToken } from '@/apis/utils/instances';
import AppClientLayout from '@/layouts/AppClientLayout';
import { AuthProvider } from '@/store/providers/AuthProvider';
import AuthServerUtils from '@/utils/AuthUtils.server';
import Script from 'next/script';

const pretendard = localFont({
  src: '../static/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
});

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

  // const userData = await UserApi.getUserDataSelf();
  const userData = {};

  return (
    <html lang="en">
      <head>
        <FrontHead />
      </head>
      <body className={`${pretendard.variable}`}>
        <AuthProvider authToken={authToken} userData={userData}>
          <AppClientLayout />
          {children}
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
