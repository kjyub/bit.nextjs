import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/css/globals.css';
import { auth } from '@/auth';
import AppClientLayout from '@/layouts/AppClientLayout';
import { AuthProvider } from '@/store/providers/AuthProvider';
import { SessionProvider } from 'next-auth/react';
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
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <FrontHead />
      </head>
      <body className={`${pretendard.variable}`}>
        <SessionProvider session={session}>
          <AuthProvider>
            <AppClientLayout />
            {children}
          </AuthProvider>
        </SessionProvider>
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
        crossorigin="anonymous"
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
