import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/styles/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                pretendard: ["var(--font-pretendard)"]
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                gray: {
                    75: "#f6f7f8",
                    150: "#eceef1",
                    250: "#c7ccd4",
                    275: "#cbced1",
                },
                sage: {
                    50: "#f9fbfa",
                    60: "#f7fff9",
                    75: "#f6f8f7",
                    100: "#f3f6f4",
                    150: "#ECF1EE",
                    200: "#e5ebe7",
                    300: "#d1dbd5",
                    350: "#b0ccbc",
                    400: "#9cafa3",
                    500: "#6b8072",
                    600: "#4b6355",
                    700: "#375141",
                    800: "#1f3729",
                    900: "#112718",
                    950: "#031207",
                },
                kakao: {
                    container: "#FEE500",
                    symbol: "#000000",
                    text: "rgba(0, 0, 0, 0.85)",
                }
            },
            spacing: {
                n1: "-0.25rem",
                n2: "-0.5rem",
                n4: "-1rem",
                n8: "-2rem",
                0.25: "0.0625rem",
                0.5: "0.125rem",
                0.75: "0.1875rem",
                1.25: "0.3125rem",
                1.5: "0.375rem",
                1.75: "0.4375rem",
                2.5: "0.625rem",
                128: "32rem",
                192: "48rem",
                256: "64rem",
            },
            width: {
                128: "32rem",
                136: "36rem",
                156: "44rem",
                192: "48rem",
                256: "64rem",
                384: "96rem",
                512: "128rem",
                inherit: "inherit",
            },
            height: {
                112: "28rem",
                128: "32rem",
                156: "44rem",
                192: "48rem",
                256: "64rem",
                384: "96rem",
                512: "128rem",
                "1/12": "8.333333%",
                "2/12": "16.666667%",
                "3/12": "25%",
                "4/12": "33.333333%",
                "5/12": "41.666667%",
                "6/12": "50%",
                "7/12": "58.333333%",
                "8/12": "66.666667%",
                "9/12": "75%",
                "10/12": "83.333333%",
                "11/12": "91.666667%",
            },
            animation: {
                "pulse-fast": "pulse 1s linear infinite",
                "fade-in": "fade-in 1s ease-in-out",
                "modal-scale-up": "modal-scale-up 0.3s ease-in",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0.3" },
                    "100%": { opacity: "1" },
                },
                "scale-up": {
                    "0%": { transform: "scale(0.5)" },
                    "100%": { transform: "scale(1)" },
                }
            },
            lineHeight: {
                '100': '1', // line-height를 100%로 설정 (1 = 100%)
            },
            fontSize: {
                'xs': ['0.75rem', '1'], // 작은 텍스트 크기에서 line-height를 100%로 설정
                'sm': ['0.875rem', '1'],
                'base': ['1rem', '1'],
                'lg': ['1.125rem', '1'],
                'xl': ['1.25rem', '1'],
                '2xl': ['1.5rem', '1'],
                '3xl': ['1.875rem', '1'],
                '4xl': ['2.25rem', '1'],
                '5xl': ['3rem', '1'],
                '6xl': ['3.75rem', '1'],
                '7xl': ['4.5rem', '1'],
            },
        },
    },
    plugins: [],
} satisfies Config;
