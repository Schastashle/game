import dotenv from 'dotenv'
import cors from 'cors'
import { createServer as createViteServer } from 'vite'
import type { ViteDevServer } from 'vite'
import express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import jsesc from 'jsesc'
import { createProxyMiddleware } from 'http-proxy-middleware'
import bodyParser from 'body-parser'
import cookieParser, { CookieParseOptions } from 'cookie-parser'

import CommentRoute from './routes/v1/comment'
import ReplyRoute from './routes/v1/reply'
import TopicRoute from './routes/v1/topic'
import UserRoute from './routes/v1/user'
import ThemeRoute from './routes/v1/theme'
import ReactionRoute from './routes/v1/reaction'

import CheckAuth from './middleware/checkAuth'

import {
  FORUM_PATH,
  YANDEX_URL,
  YANDEX_API_PATH,
  FIAR_API_PATH,
} from './constants'
import { dbConnect } from './db'
import initModels from './init/initModels'

console.info('DOTENV_CONFIG_PATH', process.env.DOTENV_CONFIG_PATH)
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH })
globalThis._FIAR_ENV_ = { PUBLISH_URL: process.env.PUBLISH_URL }

const PATHS = {
  FIAR_API_PATH: FIAR_API_PATH,
  API: '/api',
  ASSETS: '/assets',
  FORUM: FORUM_PATH,
  YA_API: YANDEX_API_PATH,
}

const isDev = () => process.env.NODE_ENV === 'development'
const PORT = Number(process.env.SERVER_PORT)
const CLIENT_PATH = path.dirname(require.resolve('client'))
const CLIENT_DIST_PATH = path.join(CLIENT_PATH, 'dist')
const CLIENT_DIST_SSR_PATH = require.resolve('client/dist-ssr/client.cjs')

async function startServer() {
  const app = express()

  /* app.use('*', (req, _, next) => {
    console.log((new Date()), "originalUrl=" + req.originalUrl)   
    next();
  })*/
  // Cannot set headers after they are sent to the client
  app.use(cookieParser() as (options: CookieParseOptions) => void)

  app.use(
    PATHS.YA_API,
    createProxyMiddleware({
      changeOrigin: true,
      cookieDomainRewrite: {
        '*': '',
      },
      target: YANDEX_URL,
    })
  )

  app.use(cors())
  // отдаем статику
  let viteServer: ViteDevServer
  if (!isDev()) {
    app.use(
      PATHS.ASSETS,
      express.static(path.resolve(CLIENT_DIST_PATH, 'assets'))
    )
  } else {
    viteServer = await createViteDevServer(CLIENT_PATH)
    app.use(viteServer.middlewares)
  }

  app.get(PATHS.API, (_, res) => {
    res.json('👋 Howdy from the server :)')
  })

  app.use(
    [PATHS.FORUM, PATHS.FIAR_API_PATH, PATHS.API],
    async (req, res, next) => {
      await CheckAuth(req, res, next)
      if (!res.locals.user) {
        res.status(401).send('Not authorized')
      }
    }
  )

  app.use(PATHS.FORUM, bodyParser.json())
  app.use(CommentRoute)
  app.use(ReplyRoute)
  app.use(TopicRoute)
  app.use(UserRoute)
  app.use(ThemeRoute)
  app.use(ReactionRoute)

  // аккуратно делать синхронные use, после асинхронных
  app.use('*', async (req, res, next) => {
    if (req.originalUrl.indexOf('.') !== -1) {
      return
    }

    await CheckAuth(req, res, next)

    try {
      const html = await getSSRIndexHTML(req, res, viteServer)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (viteServer) viteServer.ssrFixStacktrace(e as Error)
      next(e)
    }
  })

  if (!isDev()) {
    app.use(
      '/',
      express.static(CLIENT_DIST_PATH, { fallthrough: true, index: false })
    )
  }

  // обязательно должно быть 4 параметра в errorHandler, иначе не работает
  const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(`Ошибка при обработке запроса: ${_req.url}`)
    console.error(err.stack)
    res.status(500).send('Что-то сломалось!')
  }

  app.use(errorHandler)

  await dbConnect()

  app.listen(PORT, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${PORT}`)
  })
}

interface SSRModule {
  render: (
    url: string,
    repository: unknown
  ) => Promise<[Record<string, unknown>, string]>
}

async function getSSRIndexHTML(
  req: express.Request,
  res: express.Response,
  viteServer: ViteDevServer
) {
  const url = req.originalUrl
  const rootPath = isDev() ? CLIENT_PATH : CLIENT_DIST_PATH

  // CheckAuth запишет пользователя в res.locals.user
  const user = res.locals.user

  let template = fs.readFileSync(path.resolve(rootPath, 'index.html'), 'utf-8')

  let ssrModule: SSRModule

  if (isDev()) {
    template = await viteServer.transformIndexHtml(url, template)
    ssrModule = (await viteServer.ssrLoadModule(
      path.resolve(rootPath, 'ssr.tsx')
    )) as SSRModule
  } else {
    ssrModule = await import(CLIENT_DIST_SSR_PATH)
  }

  const [initialState, appHtml] = await ssrModule.render(
    user ? url : '/signin', // делаем редирект на /signin если не авторизированы
    // Promise.reject обязательно, для store нужна ошибка
    {
      getCurrent: () =>
        user ? Promise.resolve(user) : Promise.reject('не авторизован'),
    }
  )
  const initStateSerialized = jsesc(JSON.stringify(initialState), {
    json: true,
    isScriptContext: true,
  })

  const html = template
    .replace(`<!--ssr-outlet-->`, appHtml)
    .replace('`<!--store-data-->`', initStateSerialized)
    .replace('`<!--fiar-env-->`', JSON.stringify(globalThis._FIAR_ENV_))

  return html
}

async function createViteDevServer(srcPath: string) {
  const viteServer = await createViteServer({
    server: { middlewareMode: true },
    root: srcPath,
    appType: 'custom',
  })

  return viteServer
}

startServer()
initModels.init()
