import { Route, Routes } from 'react-router-dom'

import {
  Home,
  Signin,
  Signup,
  Error,
  Forum,
  Game,
  Profile,
  Rating,
  Topic,
} from '../views'
import { FC } from 'react'

interface IAppRouter {
  isAuth: boolean
}

const AppRouter: FC<IAppRouter> = ({ isAuth }) => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/signin" element={<Signin isAuth={isAuth} />} />
    <Route path="/signup" element={<Signup isAuth={isAuth} />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/game" element={<Game />} />
    <Route path="/rating" element={<Rating />} />
    <Route path="/forum" element={<Forum />} />
    <Route path="/forum/:id" element={<Topic />} />
    <Route path="*" element={<Error />} />
  </Routes>
)

export default AppRouter
