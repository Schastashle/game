import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import AppRouter from './router/AppRouter'

interface IUser {
  avatar: string
  display_name: string
  email: string
  first_name: string
  id: number
  login: string
  phone: string
  second_name: string
}

export type TypeGlobalContent = {
  user: IUser
  setUser: (u: IUser) => void
  isAuth: boolean
  setAuth: (auth: boolean) => void
}

export const MyContext = createContext<TypeGlobalContent>({
  user: {
    avatar: '',
    display_name: '',
    email: '',
    first_name: '',
    id: 0,
    login: '',
    phone: '',
    second_name: '',
  },
  isAuth: false,
  setAuth: () => {
    return false
  },
  setUser: () => {
    return false
  },
})

function App() {
  const [isAuth, setAuth] = useState(false)
  const [user, setUser] = useState<IUser>({
    avatar: '',
    display_name: '',
    email: '',
    first_name: '',
    id: 0,
    login: '',
    phone: '',
    second_name: '',
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT__}`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
    }

    fetchServerData()
  }, [])

  const fetchGetUser = async () => {
    axios
      .get('https://ya-praktikum.tech/api/v2/auth/user', {
        withCredentials: true,
      })
      .then(response => {
        setAuth(true)
        setUser(response.data)
        navigate('/')
      })
      .catch(err => {
        console.error('err', err.response.data)
        setAuth(false)
        navigate('/signin')
      })
  }

  useEffect(() => {
    fetchGetUser()
  }, [isAuth])

  return (
    <MyContext.Provider value={{ user, setUser, isAuth, setAuth }}>
      <AppRouter isAuth={isAuth} />
    </MyContext.Provider>
  )
}

export default App
