import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
  BelongsTo,
} from 'sequelize-typescript'
import TopicModel from './Topic.model'
import UserModel from './User.model'
import ReplyModel from './Reply.model'
import CommentModel from './Comment.model'

@Table({ tableName: 'reactions', paranoid: false })
class ReactionModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  override id!: number

  @Column({ type: DataType.STRING, allowNull: false })
  emoji!: string

  @ForeignKey(() => TopicModel)
  @Column(DataType.INTEGER)
  topic_id: number

  @BelongsTo(() => TopicModel)
  topic: TopicModel

  @ForeignKey(() => CommentModel)
  @Column(DataType.INTEGER)
  comment_id: number

  @BelongsTo(() => CommentModel)
  comment: CommentModel

  @ForeignKey(() => ReplyModel)
  @Column(DataType.INTEGER)
  reply_id: number

  @BelongsTo(() => ReplyModel)
  reply: ReplyModel

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  author_id!: number

  @BelongsTo(() => UserModel)
  author!: UserModel
}

export default ReactionModel
