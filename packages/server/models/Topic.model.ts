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
import { TOPIC_NAME_LENGTH_MIN, TOPIC_NAME_LENGTH_MAX } from './constants'
import CommentModel from './Comment.model'
import ReactionModel from './Reaction.model'

@Table({
  tableName: 'topics',
  paranoid: false,
})
class TopicModel extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  topic_id: number

  @Length({ max: TOPIC_NAME_LENGTH_MAX, min: TOPIC_NAME_LENGTH_MIN })
  @Column(DataType.STRING)
  name: string

  @Column(DataType.INTEGER)
  author_id: number

  @HasMany(() => CommentModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  comment: CommentModel[]

  @HasMany(() => ReactionModel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  reaction: ReactionModel[]
}

export default TopicModel
