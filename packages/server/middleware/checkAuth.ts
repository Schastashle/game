import type express from 'express'
import { YandexAPIRepository } from '../repositories/YandexAPIRepository'

type YA_COOKIES = {
  uuid: string
  authCookie: string
}

export default async (req: express.Request, res: express.Response) => {
  const { uuid, authCookie } = req.cookies as YA_COOKIES
  let user

  if (uuid && authCookie) {
    const ya = new YandexAPIRepository(req.headers['cookie'])
    user = await ya.getCurrent()
  }

  res.locals.user_id = user?.id
  res.locals.user = user

  return
}
