import UserModel from '../models/User.model'

class User {
  public readonly id: number
  public readonly name: string | unknown

  constructor({ id, name }: { id: number; name?: string }) {
    this.id = id
    this.name = name
  }

  async getUser() {
    const user = await UserModel.findOne({
      where: {
        user_id: this.id,
      },
    })

    if (!user) {
      const {
        dataValues: { user_id, name },
      } = await this.createUser()
      return { user_id, name }
    }

    return {
      name: user.name,
      user_id: user.user_id,
    }
  }

  async createUser() {
    return await UserModel.create({
      user_id: this.id,
      name: this.name as string,
    })
  }
}

export default User
