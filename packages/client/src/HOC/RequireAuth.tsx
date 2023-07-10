import { useAppSelector } from '../hooks/reduxHooks'
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface IRequireAuth {
  children: ReactNode
}

const RequireAuth = ({ children }: IRequireAuth) => {
  const { isAuth } = useAppSelector(state => state.user)
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to="/signin" state={{ from: location }} />
  }

  return <>{children}</>
}

export default RequireAuth
