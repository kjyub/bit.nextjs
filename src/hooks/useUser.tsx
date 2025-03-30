import User from '@/types/users/User'
import AuthUtils from '@/utils/AuthUtils'
import CommonUtils from '@/utils/CommonUtils'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useUser = (getNewUser: boolean = false, isSessionUserUpdate: boolean = false): [User, boolean] => {
  const { data: session, update } = useSession()
  const [user, setUser] = useState<User>(new User())
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (session) {
      const _user = new User()
      _user.parseResponse(session.user)
      setUser(_user)

      // 새로운 데이터를 가져오는 경우
      if (getNewUser) {
        getCurrentUser()
      }
    } else {
      setUser(new User())
    }

    setLoading(false)
  }, [session ? session.status : null])

  useEffect(() => {
    if (session) {
      const _user = new User()
      _user.parseResponse(session.user)
      setUser(_user)
    }
  }, [session ? session.user : null])

  const getCurrentUser = async () => {
    // 세션에 저장된 데이터까지 업데이트 하는 경우
    if (isSessionUserUpdate) {
      const newUser = await AuthUtils.getCurrentUser(session, update)

      if (CommonUtils.isStringNullOrEmpty(newUser.uuid)) {
        signOut()
      }
      setUser(newUser)
    } else {
      const newUser = await AuthUtils.getCurrentUser()

      if (CommonUtils.isStringNullOrEmpty(newUser.uuid)) {
        signOut()
      }
      setUser(newUser)
    }
  }

  return [user, isLoading]
}
