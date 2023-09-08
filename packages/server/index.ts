import dotenv from 'dotenv'
import cors from 'cors'
import { createServer as createViteServer } from 'vite'
import type { ViteDevServer } from 'vite'
import express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import jsesc from 'jsesc'
import { YandexAPIRepository } from './repositories/YandexAPIRepository'

import bodyParser from 'body-parser'
import cookieParser, { CookieParseOptions } from 'cookie-parser'

import CommentRoute from './routes/v1/comment'
import ReplyRoute from './routes/v1/reply'
import TopicRoute from './routes/v1/topic'
import UserRoute from './routes/v1/user'
import ThemeRoute from './routes/v1/theme'
import ReactionRoute from './routes/v1/reaction'

import CheckAuth from './middleware/checkAuth'
import { BASE_URL } from './constants'

dotenv.config()

const isDev = () => process.env.NODE_ENV === 'development'

import { dbConnect } from './db'
import initModels from './init/initModels'

async function startServer() {
  const app = express()

  app.use(
    cors({
      origin: 'http://fiar.ya-praktikum.tech',
      credentials: true,
    })
  )

  app.use(BASE_URL, bodyParser.json())
  app.use(cookieParser() as (options: CookieParseOptions) => void)

  app.use(BASE_URL, CheckAuth)

  app.use(CommentRoute)
  app.use(ReplyRoute)
  app.use(TopicRoute)
  app.use(UserRoute)
  app.use(ThemeRoute)
  app.use(ReactionRoute)

  const port = Number(process.env.SERVER_PORT) || 3000

  let viteServer: ViteDevServer
  const distPath = path.dirname(require.resolve('client/dist/index.html'))
  const srcPath = path.dirname(require.resolve('client'))
  const ssrClientPath = require.resolve('client/dist-ssr/client.cjs')

  if (isDev()) {
    viteServer = await createViteServer({
      server: { middlewareMode: true },
      root: srcPath,
      appType: 'custom',
    })

    app.use(viteServer.middlewares)
  }

  app.use(
    '/api/v2',
    createProxyMiddleware({
      changeOrigin: true,
      cookieDomainRewrite: {
        '*': '',
      },
      target: 'https://ya-praktikum.tech',
    })
  )

  app.get('/api', (_, res) => {
    // тест окружения
    const serv_port = process.env.SERVER_PORT
    const postgres_user = process.env.POSTGRES_USER
    const postgres_pass = process.env.POSTGRES_PASSWORD
    const postgres_db = process.env.POSTGRES_DB
    const postgres_port = process.env.POSTGRES_PORT
    const postgres_host = process.env.POSTGRES_HOST
    res.json(
      `👋 Howdy from the server :), SERVER_PORT: ${serv_port}, 
      POSTGRES_USER: ${postgres_user}, POSTGRES_PASSWORD: ${postgres_pass}, 
      POSTGRES_DB: ${postgres_db}, POSTGRES_PORT: ${postgres_port}, POSTGRES_HOST: ${postgres_host}`
    )
  })

  if (!isDev()) {
    app.use('/assets', express.static(path.resolve(distPath, 'assets')))
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    if (!req.get('accept')?.includes('html')) {
      next()
      return
    }

    try {
      let template: string

      if (!isDev()) {
        template = fs.readFileSync(
          path.resolve(distPath, 'index.html'),
          'utf-8'
        )
      } else {
        template = fs.readFileSync(path.resolve(srcPath, 'index.html'), 'utf-8')

        template = await viteServer.transformIndexHtml(url, template)
      }

      interface SSRModule {
        render: (
          url: string,
          repository: unknown
        ) => Promise<[Record<string, unknown>, string]>
      }

      let ssrModule: SSRModule

      if (isDev()) {
        ssrModule = (await viteServer.ssrLoadModule(
          path.resolve(srcPath, 'ssr.tsx')
        )) as SSRModule
      } else {
        ssrModule = await import(ssrClientPath)
      }

      const { render } = ssrModule
      const [initialState, appHtml] = await render(
        url,
        new YandexAPIRepository(req.headers['cookie'])
      )
      const initStateSerialized = jsesc(JSON.stringify(initialState), {
        json: true,
        isScriptContext: true,
      })
      const html = template
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace('<!--store-data-->', initStateSerialized)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (isDev()) {
        viteServer.ssrFixStacktrace(e as Error)
      }
      next(e)
    }
  })

  if (!isDev()) {
    app.use('/', express.static(path.resolve(distPath)))
  }

  await dbConnect()

  app.listen(port, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
  })
}

startServer()
initModels.init()
