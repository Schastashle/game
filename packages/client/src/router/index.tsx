import { createBrowserRouter, redirect } from 'react-router-dom'

import {
  Home,
  Signin,
  Signup,
  Forum,
  Game,
  Profile,
  Rating,
  Topic,
  ErrorPage,
} from '../views'

export default createBrowserRouter([
  {
    path: '*',
    element: <ErrorPage status={404} />,
  },
  {
    path: '/',
    loader: async () => {
      return redirect('/signin')
    },
  },
  {
    path: 'signin',
    element: <Signin />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'signup',
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'profile',
    element: <Profile />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'home',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'game',
    element: <Game />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'rating',
    element: <Rating />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'forum',
    element: <Forum />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'forum/:id',
        element: <Topic />,
        errorElement: <ErrorPage />,
      },
    ],
  },
])
