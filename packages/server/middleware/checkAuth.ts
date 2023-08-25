import { YANDEX_API } from '../constants'

export default async (
  req: { cookies: { uuid: any; authCookie: any } },
  res: any,
  next: any
) => {
  const { uuid, authCookie } = req.cookies

  if (!(uuid && authCookie)) return res.status(403).send('Not authorized')

  const response = await fetch(`${YANDEX_API}/auth/user`, {
    method: 'GET',
    headers: {
      Cookie: `uuid=${uuid};authCookie=${authCookie}`,
    },
  })
  const user = await response.json()

  if (Object.prototype.hasOwnProperty.call(user, 'reason'))
    return res.status(403).send('Not authorized')

  next()
}
