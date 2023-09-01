import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Length,
} from 'sequelize-typescript'
import { USER_NAME_LENGTH_MAX, USER_NAME_LENGTH_MIN } from './constants'

@Table({
  tableName: 'users',
  paranoid: false,
})
class UserModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  override id: number

  @Column(DataType.INTEGER)
  user_id: number

  @Length({ max: USER_NAME_LENGTH_MAX, min: USER_NAME_LENGTH_MIN })
  @Column(DataType.STRING)
  name: string
}

export default UserModel
