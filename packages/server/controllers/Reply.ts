import CommentModel from '../models/Comment.model'
import ReplyModel from '../models/Reply.model'
import type { IReply, stateMessage } from './types'

class Reply {
  public readonly id: number | null
  public readonly comment_id: number | null
  public readonly author_id: number | null
  public readonly reply_id: number | null
  public readonly replies: number[]
  public readonly text: string | null

  constructor({
    id = null,
    comment_id = null,
    author_id = null,
    reply_id = null,
    replies = [],
    text = null,
  }: IReply) {
    this.id = id
    this.comment_id = comment_id
    this.author_id = author_id
    this.reply_id = reply_id
    this.replies = replies
    this.text = text
  }

  public async createReply(): Promise<stateMessage> {
    const reply = (
      await ReplyModel.create({
        comment_id: this.comment_id,
        author_id: this.author_id as number,
        replies: this.replies,
        reply_id: this.reply_id,
        text: this.text as string,
      })
    ).dataValues

    if (this.comment_id && !this.reply_id) {
      const comment = await CommentModel.findOne({
        where: {
          id: this.comment_id,
        },
      })

      if (!comment)
        return { success: false, message: "Parent comment wasn't found" }

      comment.replies = [...comment.replies, reply.id]
      await comment.save()
    } else if (!this.comment_id && this.reply_id) {
      const targetReply = await ReplyModel.findOne({
        where: {
          id: this.reply_id,
        },
      })

      if (!targetReply)
        return { success: false, message: "Parent reply wasn't found" }

      targetReply.replies = [...targetReply.replies, reply.id]
      await targetReply.save()
    }

    return { success: true, message: 'OK' }
  }

  public async getReplyById(): Promise<ReplyModel | stateMessage> {
    const reply = await ReplyModel.findOne({
      where: {
        id: this.id as number,
      },
    })

    if (!reply) return { success: false, message: "Reply wasn't found" }

    return reply
  }
}

export default Reply
