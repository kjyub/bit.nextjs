// app/fonts.ts
import localFont from 'next/font/local';

export const sinchonRhapsody = localFont({
  src: '../../public/fonts/SinchonRhapsodyTTF-ExtraBold.ttf',
  variable: '--font-sinchon-rhapsody',
  weight: '45 920',
  style: 'normal',
  display: 'swap',
});

export const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
});
