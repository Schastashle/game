import {
  AutoIncrement,
  Table,
  Model,
  PrimaryKey,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import Comment from './Comment.model'

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

  @ForeignKey(() => Comment)
  @Column(DataType.INTEGER)
  comment_id: number

  @BelongsTo(() => Comment)
  comment: Comment

  @Column(DataType.INTEGER)
  author_id: number
}

export default ReplyModel
