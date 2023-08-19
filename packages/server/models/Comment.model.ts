import {
  AutoIncrement,
  Column,
  DataType,
  Length,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import { COMMENT_LENGTH_MIN, COMMENT_LENGTH_MAX } from './constants'

@Table({
  tableName: 'comments',
  paranoid: false,
})
class CommentModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  override id: number

  @Column(DataType.INTEGER)
  topic_id: number

  @Column(DataType.INTEGER)
  author_id: number

  @Column(DataType.ARRAY(DataType.INTEGER))
  replies: number[]

  @Length({ max: COMMENT_LENGTH_MAX, min: COMMENT_LENGTH_MIN })
  @Column(DataType.STRING)
  text: string
}

export default CommentModel
