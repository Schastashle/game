import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IAppState, createStore } from './store'
import App from './App'
import { ErrorBoundary } from './components'

import './index.css'
import { UserService } from './api/userService'
import { YandexAPIRepository } from './api/repositories/YandexAPIRepository'

declare const window: Window &
  typeof globalThis & {
    __PRELOADED_STATE__?: IAppState
  }

const store = createStore(
  new UserService(new YandexAPIRepository()),
  window.__PRELOADED_STATE__
)

delete window.__PRELOADED_STATE__

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
