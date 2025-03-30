'use client'

import CommonUtils from '@/utils/CommonUtils'
import axios from 'axios'
import { getSession } from 'next-auth/react'

// const URL = "http://172.30.1.46:8000"
// const URL = "http://127.0.0.1:8000"
const URL = process.env.NEXT_PUBLIC_DJANGO_SERVER

const axiosApi = (options: object): axios.AxiosInstance => {
  return axios.create({ baseURL: URL, ...options })
}

const axiosCredentialApi = (options: object) => {
  const api = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  return api
}

const axiosAuthApi = (options: object) => {
  const api = axios.create({
    baseURL: URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // 요청 시
  api.interceptors.request.use(
    async (config) => {
      const session = await getSession()

      if (session === null) {
        return config
      }

      const djangoToken = session.accessToken

      // 쿠키가 없는 경우 http only 쿠키에서 보낸다.
      if (!CommonUtils.isStringNullOrEmpty(djangoToken)) {
        config.headers.Authorization = `Bearer ${djangoToken}`
      }

      return config
    },
    async (error) => {
      return Promise.reject(error)
    },
  )
  // 응답 시
  api.interceptors.response.use(
    (config) => {
      return config
    },
    async (error) => {
      const originalRequest = error.config as object
      console.log(error)

      // 재요청 실패
      if (error.response.status === 401 && error._retry) {
        return Promise.reject(error)
      }

      // 재요청 시도
      if (error.response.status === 401) {
        console.log('RE SignIn')
        // signIn("google")
        return await axios(originalRequest)
      }

      return Promise.reject(error)
    },
  )
  return api
}

const axiosBothApi = (options: object) => {
  const api = axiosAuthApi(options)
  // 기존 request 를 지운다.
  api.interceptors.request.clear()
  // 요청 시
  api.interceptors.request.use(
    (config) => {
      const cookie = getCookie(ConstCookie.USER_ACCESS_TOKEN)
      if (cookie !== undefined) {
        config.headers.Authorization = `Bearer ${cookie}`
      }
      return config
    },
    async (error) => {
      return Promise.reject(error)
    },
  )
  return api
}

export const credentialInstance = axiosCredentialApi()
export const defaultInstance = axiosApi()
export const authInstance = axiosAuthApi()
export const defaultOrAuthInstance = axiosBothApi()
export const fileNoneAuthInstance = axiosApi({
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const fileInstance = axiosAuthApi({
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const downloadInstance = axiosApi({ responseType: 'blob' })
