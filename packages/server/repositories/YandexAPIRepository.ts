import axios from 'axios'

const API_ROOT = 'https://ya-praktikum.tech/api/v2/'

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
  async getCurrent(): Promise<IUser> {
    const { data } = await axios.get(`${API_ROOT}/auth/user`, {
      headers: {
        cookie: this._cookieHeader,
      },
    })
    return {
      ...data,
    }
  }
}
