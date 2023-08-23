import ReplyModel from '../models/Reply.model'
import type { IReply, stateMessage } from './types'

class Reply {
  public readonly id: number | null
  public readonly author_id: number | null
  public readonly comment_id: number | null
  public readonly text: string | null

  constructor({
    id = null,
    author_id = null,
    comment_id = null,
    text = null,
  }: IReply) {
    this.id = id
    this.author_id = author_id
    this.comment_id = comment_id
    this.text = text
  }

  public async createReply(): Promise<stateMessage> {
    const reply = (
      await ReplyModel.create({
        author_id: this.author_id as number,
        comment_id: this.comment_id as number,
        text: this.text as string,
      })
    ).dataValues

    return reply
  }

  public async getReply(): Promise<ReplyModel | null> {
    const reply = await ReplyModel.findOne({
      where: {
        id: this.id as number,
      },
    })

    return reply
  }

  public async updateReply(value: string) {
    const reply: ReplyModel | null = await this.getReply()

    if (!reply) return { success: false, message: "Reply wasn't found" }

    reply.text = value
    await (reply as ReplyModel).save()

    return { success: true, message: 'Reply was updated' }
  }

  public async deleteReply() {
    const reply = await this.getReply()

    if (!reply) return { success: false, message: "Reply wasn't found" }

    await reply.destroy()

    return { success: true, message: 'Reply was delete' }
  }
}

export default Reply
