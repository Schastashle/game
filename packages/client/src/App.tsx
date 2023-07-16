import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { useAppDispatch, useAppSelector } from './hooks/reduxHooks'
import { getUser } from './store/slices/userSlice'

function App() {
  const dispatch = useAppDispatch()
  const { isAuth } = useAppSelector(state => state.user)

  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT__}`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
    }

    fetchServerData()
  }, [])

  useEffect(() => {
    dispatch(getUser())
  }, [isAuth])

  return <AppRouter isAuth={isAuth} />
}

export default App
