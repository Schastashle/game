import CommentModel from '../models/Comment.model'
import type { stateMessage, IComment, IReply } from './types'

class Comment {
  public readonly id: number
  public readonly topic_id: number | unknown
  public readonly text: string | unknown
  public readonly author_id: number | unknown
  public readonly replies: (number | IReply)[]

  constructor({ topic_id, author_id, text, id = -1, replies = [] }: IComment) {
    this.topic_id = topic_id
    this.text = text
    this.author_id = author_id
    this.id = id
    this.replies = replies
  }

  public async getCommentById(): Promise<CommentModel | null> {
    const comment = await CommentModel.findOne({
      where: { id: this.id as number },
    })

    if (!comment) return null

    return comment
  }

  public async getCommentsByTopic(): Promise<IComment[]> {
    return await CommentModel.findAll({
      where: {
        topic_id: this.topic_id as number,
      },
    })
  }

  public async createComment(): Promise<IComment | stateMessage> {
    const comment = await CommentModel.create({
      topic_id: this.topic_id as number,
      author_id: this.author_id as number,
      text: this.text as string,
      replies: this.replies as number[],
    })

    if (!comment) return { success: false, message: 'Unexpected error' }

    return comment.dataValues
  }

  public async remove(): Promise<stateMessage> {
    const comment = await this.getCommentById()

    if (!comment) return { success: false, message: "Wasn't found" }

    await comment.destroy()

    return { success: true, message: 'OK' }
  }

  public async updateCommentById(text: string): Promise<stateMessage> {
    const comment = await this.getCommentById()

    if (!comment) return { success: false, message: "Comment wasn't found" }

    comment.text = text
    await comment.save()

    return { success: true, message: 'Comment was updated' }
  }
}

export default Comment
