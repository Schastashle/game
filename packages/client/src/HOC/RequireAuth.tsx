import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getUser } from '../store/slices/userSlice'

interface IRequireAuth {
  children: ReactNode
}

const RequireAuth = ({ children }: IRequireAuth) => {
  const dispatch = useAppDispatch()
  // { isAuth } убираю, так как при этом лишние рендеры
  const isAuth = useAppSelector(state => state.user.isAuth)
  const [clientSide, setClientSide] = useState(false)
  const location = useLocation()

  // исправляет "<Navigate> must not be used on the initial render in a <StaticRouter>"
  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    dispatch(getUser())
  }, [isAuth])

  if (!isAuth && clientSide) {
    return <Navigate to="/signin" state={{ from: location }} />
  }

  return <>{children}</>
}

export default RequireAuth
