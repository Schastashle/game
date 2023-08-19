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
  tableName: 'replies',
})
class Reply extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  override id: number

  @Column(DataType.INTEGER)
  comment_id: number | null

  @Column(DataType.INTEGER)
  reply_id: number | null

  @Column(DataType.ARRAY(DataType.INTEGER))
  replies: number[]

  @Column(DataType.INTEGER)
  author_id: number

  @Length({ max: COMMENT_LENGTH_MAX, min: COMMENT_LENGTH_MIN })
  @Column(DataType.STRING)
  text: string
}

export default Reply
