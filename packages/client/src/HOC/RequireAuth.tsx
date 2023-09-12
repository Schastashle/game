import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ReactNode, useEffect, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { loginWithOAuth } from '../store/slices/userSlice'

interface IRequireAuth {
  children: ReactNode
}

const RequireAuth = ({ children }: IRequireAuth) => {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(state => state.user?.isAuth)
  const sent = useRef(false)
  const location = useLocation()

  const { search } = useLocation()

  useEffect(() => {
    if (!isAuth) {
      const urlParams = new URLSearchParams(search)
      const code = urlParams.get('code')

      // замечены проблемы, если рядом с запросом токена идут запросы за получением
      // информации о пользователе
      // убираю лишние запрос
      if (!sent.current && code) {
        sent.current = true
        dispatch(loginWithOAuth(code))
      }
    }
  }, [search])

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
