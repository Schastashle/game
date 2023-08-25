import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Length,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'
import Topic from './Topic.model'
import Reply from './Reply.model'
import { COMMENT_LENGTH_MIN, COMMENT_LENGTH_MAX } from './constants'

@Table({
  tableName: 'comments',
  paranoid: false,
})
class CommentModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  comment_id: number

  @Column(DataType.INTEGER)
  author_id: number

  @ForeignKey(() => Topic)
  @Column(DataType.INTEGER)
  topic_id: number

  @BelongsTo(() => Topic)
  topic: Topic

  @Length({ max: COMMENT_LENGTH_MAX, min: COMMENT_LENGTH_MIN })
  @Column(DataType.STRING)
  text: string

  @HasMany(() => Reply, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  reply: Reply[]
}

export default CommentModel
