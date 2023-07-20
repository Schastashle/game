import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import RequireAuth from '../HOC/RequireAuth'

import {
  Home,
  Signin,
  Signup,
  ErrorPage,
  Forum,
  Game,
  Profile,
  FinishPage,
  Rating,
  ForumTopic,
} from '../views'

interface IAppRouter {
  isAuth: boolean
}

const AppRouter: FC<IAppRouter> = ({ isAuth }) => (
  <Routes>
    <Route
      path="/"
      element={
        <RequireAuth>
          <Home />
        </RequireAuth>
      }
    />
    <Route path="/signin" element={<Signin isAuth={isAuth} />} />
    <Route path="/signup" element={<Signup isAuth={isAuth} />} />
    <Route
      path="/profile"
      element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      }
    />
    <Route
      path="/game"
      element={
        <RequireAuth>
          <Game />
        </RequireAuth>
      }
    />
    <Route
      path="/finish"
      element={
        <RequireAuth>
          <FinishPage />
        </RequireAuth>
      }
    />
    <Route
      path="/rating"
      element={
        <RequireAuth>
          <Rating />
        </RequireAuth>
      }
    />
    <Route
      path="/forum"
      element={
        <RequireAuth>
          <Forum />
        </RequireAuth>
      }
    />
    <Route
      path="/forum/:id"
      element={
        <RequireAuth>
          <ForumTopic />
        </RequireAuth>
      }
    />
    <Route
      path="*"
      element={
        <RequireAuth>
          <ErrorPage />
        </RequireAuth>
      }
    />
  </Routes>
)

export default AppRouter
