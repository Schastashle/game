import App from './src/App'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore } from './src/store'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom/server'
import { UserRepository, UserService } from './src/api/userService'
import { getUser } from './src/store/slices/userSlice'

async function render(url: string, repository: UserRepository) {
  const store = createStore(new UserService(repository))

  await store.dispatch(getUser())
  const preloadedState = store.getState()

  const renderResult = renderToString(
    <React.StrictMode>
      <Provider store={store}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </Provider>
    </React.StrictMode>
  )
  return [preloadedState, renderResult]
}

export { render }
