import CommentModel from '../models/Comment.model'
import ReplyModel from '../models/Reply.model'
import type { stateMessage, IComment } from './types'

class Comment {
  public readonly id: number
  public readonly topic_id: number | unknown
  public readonly text: string | unknown
  public readonly author_id: number | unknown

  constructor({ topic_id, author_id, text, id = -1 }: IComment) {
    this.topic_id = topic_id
    this.text = text
    this.author_id = author_id
    this.id = id
  }

  public async getComment(): Promise<CommentModel | null> {
    const comment = await CommentModel.findOne({
      where: {
        comment_id: this.id as number,
      },
      include: [ReplyModel],
    })

    if (!comment) return null

    return comment
  }

  public async createComment(): Promise<IComment | stateMessage> {
    const comment = await CommentModel.create({
      topic_id: this.topic_id as number,
      author_id: this.author_id as number,
      text: this.text as string,
    })

    if (!comment) return { success: false, message: 'Unexpected error' }

    return comment.dataValues
  }

  public async remove(): Promise<stateMessage> {
    const comment = await this.getComment()

    if (!comment) return { success: false, message: "Wasn't found" }

    await comment.destroy()

    return { success: true, message: 'OK' }
  }

  public async updateComment(text: string): Promise<stateMessage> {
    const comment = await this.getComment()

    if (!comment) return { success: false, message: "Comment wasn't found" }

    comment.text = text
    await comment.save()

    return { success: true, message: 'Comment was updated' }
  }
}

export default Comment
