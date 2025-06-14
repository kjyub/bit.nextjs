/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.0.69',
        port: '8000', // 포트가 명시되지 않은 경우 비워둡니다.
        pathname: '/**', // 모든 경로 허용
      },
      {
        protocol: 'http',
        hostname: '192.0.0.2',
        port: '8000', // 포트가 명시되지 않은 경우 비워둡니다.
        pathname: '/**', // 모든 경로 허용
      },
      {
        protocol: 'https',
        hostname: 'kurrito.kr',
        pathname: '/**', // 모든 경로 허용
      },
      {
        protocol: 'https',
        hostname: 'kr.cafe24obs.com',
        port: '', // 포트가 명시되지 않은 경우 비워둡니다.
        pathname: '/**', // 모든 경로 허용
      },
      {
        protocol: 'https',
        hostname: 'static.upbit.com',
        port: '', // 포트가 명시되지 않은 경우 비워둡니다.
        pathname: '/**', // 모든 경로 허용
      },
    ],
  },
  reactStrictMode: false, // RootLayout 2번 실행되므로 false
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://kurrito.kr' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  output: 'standalone',
};

export default nextConfig;
