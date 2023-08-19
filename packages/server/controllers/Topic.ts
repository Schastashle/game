import TopicModel from '../models/Topic.model'
import type { stateMessage } from './types'

class Topic {
  public readonly id: number | unknown

  constructor(id: number | unknown) {
    this.id = id
  }

  async getTopic() {
    return await TopicModel.findOne({
      where: {
        id: this.id as number,
      },
    })
  }

  async createTopic(name: string, author_id: number) {
    const topic = await TopicModel.create({
      name,
      author_id,
    })

    return topic.dataValues
  }

  async getTopicById() {
    return await TopicModel.findOne({
      where: {
        id: this.id as number,
      },
    })
  }

  async getTopics() {
    return await TopicModel.findAll()
  }

  async remove(): Promise<stateMessage> {
    const topic = await this.getTopic()

    if (!topic) return { success: false, message: "Topic wasn't found" }

    await topic.destroy()

    return { success: true, message: 'OK' }
  }
}

export default Topic
