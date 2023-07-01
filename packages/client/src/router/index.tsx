import { createBrowserRouter, redirect } from 'react-router-dom'

import {
  Home,
  Signin,
  Signup,
  Error,
  Forum,
  Game,
  Profile,
  Rating,
  ForumTopic,
} from '../views'

export default createBrowserRouter([
  {
    path: '*',
    element: <div>404</div>,
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
    errorElement: <Error />,
  },
  {
    path: 'signup',
    element: <Signup />,
    errorElement: <Error />,
  },
  {
    path: 'profile',
    element: <Profile />,
    errorElement: <Error />,
  },
  {
    path: 'home',
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: 'game',
    element: <Game />,
    errorElement: <Error />,
  },
  {
    path: 'rating',
    element: <Rating />,
    errorElement: <Error />,
  },
  {
    path: 'forum',
    element: <Forum />,
    errorElement: <Error />,
    children: [
      {
        path: ':id',
        element: <ForumTopic />,
      },
    ],
  },
])
