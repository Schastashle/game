import App from './src/App'
// @ts-ignore
import React from 'react'
import { renderToString } from 'react-dom/server'
import { store } from './src/store'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom/server'

export function render(url) {
  return renderToString(
    <React.StrictMode>
      <Provider store={store}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </Provider>
    </React.StrictMode>
  )
}
