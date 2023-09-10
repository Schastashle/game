import AppRouter from './router/AppRouter'
import { useAppSelector } from './hooks/reduxHooks'

function App() {
  const isAuth = useAppSelector(state => state.user.isAuth)

  return (
    <div>
      <AppRouter isAuth={isAuth} />
    </div>
  )
}

export default App
