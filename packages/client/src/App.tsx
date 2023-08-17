import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import { getUser } from './store/slices/userSlice'

function App() {
  console.info('*** app render')
  const dispatch = useAppDispatch()
  // если поменять, то при смене аватара будет два рендера App
  // если оставить, то при смене Аватара не будет рендера App
  // при смене аватара идет перезапрос информации о пользователе
  //const isAuth = useAppSelector(state => state.user.isAuth)
  const isAuth = useAppSelector(state => state.user.isAuth)

  // временно скрыл, чтобы не было ошибок в консоли
  // useEffect(() => {
  //   const fetchServerData = async () => {
  //     const url = `http://localhost:${__SERVER_PORT__}`
  //     const response = await fetch(url)
  //     const data = await response.json()
  //     console.log(data)
  //   }

  //   fetchServerData()
  // }, [])

  useEffect(() => {
    if (!isAuth) {
      dispatch(getUser())
    }
  }, [isAuth])

  return <AppRouter isAuth={isAuth} />
}

export default App
