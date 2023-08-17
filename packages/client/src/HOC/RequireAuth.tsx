import { useAppSelector } from '../hooks/reduxHooks'
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface IRequireAuth {
  children: ReactNode
}

const RequireAuth = ({ children }: IRequireAuth) => {
  console.info('RequireAuth render')

  // { isAuth } убираю, так как при этом лишние рендеры
  const isAuth = useAppSelector(state => state.user.isAuth)
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to="/signin" state={{ from: location }} />
  }

  return <>{children}</>
}

export default RequireAuth
