import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { loginWithOAuth } from '../store/slices/userSlice'

interface IRequireAuth {
  children: ReactNode
}

const RequireAuth = ({ children }: IRequireAuth) => {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(state => state.user?.isAuth)
  const location = useLocation()
  const wait = useRef<boolean>(false)

  useEffect(() => {
    if (!isAuth) {
      const urlParams = new URLSearchParams(location.search)
      const code = urlParams.get('code')

      if (code && !wait.current) {
        wait.current = true // внутри loginWithOAuth надо проверить, что запрос уже отправлен
        dispatch(loginWithOAuth(code))
      }
    }
  }, [location, isAuth])

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
