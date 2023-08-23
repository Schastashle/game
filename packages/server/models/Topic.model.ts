import {
  AutoIncrement,
  Column,
  DataType,
  HasMany,
  Length,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import Comment from './Comment.model'
import { TOPIC_NAME_LENGTH_MIN, TOPIC_NAME_LENGTH_MAX } from './constants'

@Table({
  tableName: 'topics',
  paranoid: false,
})
class Topic extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  topic_id: number

  @Length({ max: TOPIC_NAME_LENGTH_MAX, min: TOPIC_NAME_LENGTH_MIN })
  @Column(DataType.STRING)
  name: string

  @Column(DataType.INTEGER)
  author_id: number

  @HasMany(() => Comment, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  comment: Comment[]
}

export default Topic
