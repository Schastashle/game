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
import { COMMENT_LENGTH_MIN, COMMENT_LENGTH_MAX } from './constants'
import TopicModel from './Topic.model'
import ReplyModel from './Reply.model'
import ReactionModel from './Reaction.model'

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

  @ForeignKey(() => TopicModel)
  @Column(DataType.INTEGER)
  topic_id: number

  @BelongsTo(() => TopicModel)
  topic: TopicModel

  @Length({ max: COMMENT_LENGTH_MAX, min: COMMENT_LENGTH_MIN })
  @Column(DataType.STRING)
  text: string

  @HasMany(() => ReplyModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  reply: ReplyModel[]

  @HasMany(() => ReactionModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  reaction: ReactionModel[]
}

export default CommentModel
