import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import CommonUtils from "./utils/CommonUtils"
import { defaultServerInstance } from "@/apis/utils/serverApis"
import User from "./types/users/User"
import AuthUtils from "./utils/AuthUtils"


const BACKEND_ACCESS_TOKEN_LIFETIME = 45 * 60 // 45 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 6 * 24 * 60 * 60 // 6 days
const getCurrentEpochTime = () => {
    return Math.floor(new Date().getTime() / 1000)
}

// https://velog.io/@youngjun625/Next.js14-NextAuth-v5%EB%A1%9C-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-%EB%A1%9C%EA%B7%B8%EC%9D%B8%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83
export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                userType: { label: "UserType", type: "text" },
            },
            async authorize(credentials: unknown) {
                try {
                    const response = await defaultServerInstance.post(
                        `/api/users/login/`, 
                        { email: credentials.email, password: credentials.password, user_type: credentials.userType }    
                    )
                    const data = response.data

                    const user: User = new User()
                    user.parseResponse(data.user)
                    
                    if (!CommonUtils.isStringNullOrEmpty(user.id)) {
                        const result = {
                            ...data.user,
                            accessToken: data.token.access,
                            refreshToken: data.token.refresh,
                        }

                        return result
                    }
                    throw new Error()
                } catch (err: unknown) {
                    console.log(err)
                    console.log(`/api/users/login/`)
                    throw new Error(err)
                }
            },
        }),
        Credentials({
            id: "kakao",
            name: "kakao",
            credentials: {
                code: { label: "code", type: "text" },
            },
            async authorize(credentials: unknown) {
                try {
                    const response = await defaultServerInstance.post(
                        `/api/users/kakao_auth/`, 
                        { code: credentials.code }    
                    )
                    const data = response.data

                    const user: User = new User()
                    user.parseResponse(data.user)
                    
                    if (!CommonUtils.isStringNullOrEmpty(user.uuid)) {
                        const result = {
                            ...data.user,
                            accessToken: data.token.access,
                            refreshToken: data.token.refresh,
                        }

                        return result
                    }
                    throw new Error()
                } catch (err: unknown) {
                    console.log(err, err.response.data)
                    throw new Error(err)
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // console.log("JWT!!", trigger, token, user, session)
            
            // 데이터 초기화
            if (user) {
                token.accessToken = user.accessToken
                token.refreshToken = user.refreshToken
                token.user = user
                // AccessToken 시간 설정
                token.ref = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME
            }

            // AccessToken을 refresh 할 경우
            if (getCurrentEpochTime() > token["ref"]) {
            // if (true) {
                let isRefreshed = false
                await defaultServerInstance.post(
                    `/api/users/jwt_auth/refresh/`, 
                    { refresh: token.refreshToken }    
                ).then((response) => {
                    token["accessToken"] = response.data.access
                    token["ref"] = getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME
                    isRefreshed = true
                })
                .catch((error) => {
                    //
                })

                if (!isRefreshed) {
                    token["error"] = "expired-token"
                    console.log("EXPIRED!! EXPIRED!! EXPIRED!!")
                } else {
                    console.log("REFRESHED!! REFRESHED!! REFRESHED!!")
                }
            }

            if (trigger === "update") {
                token.user = session.user
            }

            return token
        },
        async session({ session, token }) {
            // console.log("SESSION!!", session, token)
            
            session.accessToken = token.accessToken
            session.refreshToken = token.refreshToken
            session.user = token.user
            
            return session
        },
    },
})
