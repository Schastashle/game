import { UserRepository } from '../userService'
import axios from 'axios'
import { IUser } from '../../types/IUser'
import { API_ROOT } from '../../constants'

export class YandexAPIRepository implements UserRepository {
  async getCurrent(): Promise<IUser> {
    const { data } = await axios.get(`${API_ROOT}/auth/user`, {
      withCredentials: true,
    })
    return data
  }
}
