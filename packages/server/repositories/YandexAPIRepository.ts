import axios, { AxiosError } from 'axios'
import { YANDEX_API_URL } from '../constants'

export interface IUser {
  avatar: string
  display_name: string
  email: string
  first_name: string
  id: number
  login: string
  phone: string
  second_name: string
}

export class YandexAPIRepository {
  constructor(private readonly _cookieHeader: string | undefined) {}

  async getCurrent(): Promise<IUser | undefined> {
    let user: IUser | undefined
    try {
      const response = await axios.get(`${YANDEX_API_URL}/auth/user`, {
        headers: {
          cookie: this._cookieHeader,
        },
      })
      user = response.data
    } catch (exp) {
      const noAuth = exp instanceof AxiosError && exp.response?.status === 401
      if (!noAuth) throw exp
    }

    return user
  }
}
