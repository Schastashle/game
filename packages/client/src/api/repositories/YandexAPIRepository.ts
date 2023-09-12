import { UserRepository } from '../userService'
import axios from 'axios'
import { IUser } from '../../types/IUser'
import { YA_API_URL } from '../../shared/constants'

export class YandexAPIRepository implements UserRepository {
  async getCurrent(): Promise<IUser> {
    const { data } = await axios.get(`${YA_API_URL}/auth/user`, {
      withCredentials: true,
    })
    return data
  }
}
