import { createBrowserRouter, redirect } from 'react-router-dom'

import Error from '../views/Error'
import Forum from '../views/Forum'
import Game from '../views/Game'
import Home from '../views/Home/Home'
import Profile from '../views/Profile'
import Rating from '../views/Rating'
import Signup from '../views/Signup'
import Topic from '../views/Topic'
import Signin from '../views/Signin/Signin'

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
        path: 'forum/:id',
        element: <Topic />,
      },
    ],
  },
])
