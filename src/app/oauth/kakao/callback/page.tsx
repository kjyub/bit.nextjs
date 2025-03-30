'use client'

import User from '@/types/users/User'
import { AccountStatusTypes } from '@/types/users/UserTypes'
import CommonUtils from '@/utils/CommonUtils'
import { getSession, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import * as SS from '@/styles/SignupStyles'

const SignupPage = () => {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') ?? ''
  const router = useRouter()

  useEffect(() => {
    if (CommonUtils.isStringNullOrEmpty(code)) {
      router.push('/')
    } else {
      handleLogin()
    }
  }, [])

  const handleLogin = async () => {
    let response = null
    try {
      response = await signIn('kakao', {
        code: code,
        redirect: false,
      })
    } catch {
      alert('로그인에 실패하였습니다.\n관리자에게 문의해주세요.')
      router.push('/')
      return
    }

    if (!CommonUtils.isStringNullOrEmpty(response?.error)) {
      console.log(response?.error)
      alert('로그인에 실패하였습니다.')
      router.push('/')
      return
    }

    const session = await getSession()
    const userData = session?.user
    const user = new User()
    user.parseResponse(userData)

    // 이미 가입된 회원인 경우
    if (user.accountStatus === AccountStatusTypes.NORMAL) {
      router.push('/')
    } else if (user.accountStatus === AccountStatusTypes.TEMP) {
      router.push(`/signup/info`)
    } else {
      alert('이용할 수 없는 계정입니다.')
      router.push('/')
    }
  }

  return (
    <SS.Layout>
      <SS.BoxContainer className="space-y-2">
        <div className="flex flex-col items-center md:w-128">
          <SS.Title>카카오 로그인 중...</SS.Title>
        </div>
      </SS.BoxContainer>
    </SS.Layout>
  )
}

export default SignupPage
