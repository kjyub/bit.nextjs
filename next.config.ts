/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["kr.cafe24obs.com"],
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
                hostname: 'kr.cafe24obs.com',
                port: '', // 포트가 명시되지 않은 경우 비워둡니다.
                pathname: '/**', // 모든 경로 허용
            },
        ]
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    reactStrictMode: false, // RootLayout 2번 실행되므로 false
    webpack: config => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"],
        });
    
        return config;
    },
    // turbopack 관련 추가 사항 (webpack 설정)
    experimental: {
        turbo: {
            rules: {
                "*.svg": {
                    loaders: ["@svgr/webpack"],
                    as: "*.ts"
                }
            }
        }
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    },
    output: "standalone"
}

export default nextConfig
