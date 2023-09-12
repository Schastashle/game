import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getUser, loginWithOAuth } from '../store/slices/userSlice'

interface IRequireAuth {
  children: ReactNode
}

const RequireAuth = ({ children }: IRequireAuth) => {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(state => state.user?.isAuth)
  const location = useLocation()

  const { search } = useLocation()

  useEffect(() => {
    if (!isAuth) {
      const urlParams = new URLSearchParams(search)
      const code = urlParams.get('code')

      code && dispatch(loginWithOAuth(code))
    }
  }, [search])

  useEffect(() => {
    isAuth && dispatch(getUser())
  }, [isAuth])

  return (
    <>
      {!isAuth ? (
        <Navigate to="/signin" state={{ from: location }} />
      ) : (
        children
      )}
    </>
  )
}

export default RequireAuth
