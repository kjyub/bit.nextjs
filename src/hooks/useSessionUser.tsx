import User from '@/types/users/User'
import { useSession } from 'next-auth/react'

export const useSessionUser = (): User => {
  const { data: session, status } = useSession()

  if (status === 'authenticated') {
    const _user = new User()
    _user.parseResponse(session.user)
    return _user
  }

  return new User()
}
