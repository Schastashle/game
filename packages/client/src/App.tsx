import { useEffect } from 'react'
import AppRouter from './router/AppRouter'
import { useAppSelector } from './hooks/reduxHooks'
import { SERVER_URL } from './shared/constants'

function App() {
  const isAuth = useAppSelector(state => state.user.isAuth)

  useEffect(() => {
    const fetchServerData = async () => {
      const url = `${SERVER_URL}/api`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
    }

    fetchServerData()
  }, [])

  return <AppRouter isAuth={isAuth} />
}

export default App
