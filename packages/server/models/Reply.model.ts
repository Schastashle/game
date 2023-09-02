import {
  AutoIncrement,
  Table,
  Model,
  PrimaryKey,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'
import CommentModel from './Comment.model'
import ReactionModel from './Reaction.model'

@Table({
  tableName: 'replies',
  paranoid: false,
})
class ReplyModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  override id: number

  @Column(DataType.STRING)
  text: string

  @ForeignKey(() => CommentModel)
  @Column(DataType.INTEGER)
  comment_id: number

  @BelongsTo(() => CommentModel)
  comment: CommentModel

  @Column(DataType.INTEGER)
  author_id: number

  @HasMany(() => ReactionModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  reaction: ReactionModel[]
}

export default ReplyModel
