import {
  AutoIncrement,
  Column,
  DataType,
  Length,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { TOPIC_NAME_LENGTH_MIN, TOPIC_NAME_LENGTH_MAX } from './constants'

@Table({
  tableName: 'topics',
  paranoid: false,
})
class Topic extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  override id: number

  @Length({ max: TOPIC_NAME_LENGTH_MAX, min: TOPIC_NAME_LENGTH_MIN })
  @Column(DataType.STRING)
  name: string

  @Column(DataType.INTEGER)
  author_id: number
}

export default Topic
