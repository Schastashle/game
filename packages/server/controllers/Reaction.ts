import type { Request, Response } from 'express'
import ReactionModel from '../models/Reaction.model'

class Reaction {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { emoji, topic_id, comment_id, reply_id, author_id } = req.body

      const reaction = await ReactionModel.create({
        emoji,
        topic_id,
        comment_id,
        reply_id,
        author_id,
      })

      res.status(201).json(reaction)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const reaction = await ReactionModel.findByPk(id)

      if (!reaction) {
        res.status(404).json({ message: 'Reaction not found' })
        return
      }

      res.json(reaction)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params

      const reaction = await ReactionModel.findByPk(id)

      if (!reaction) {
        res.status(404).json({ message: 'Reaction not found' })
        return
      }

      await reaction.destroy()

      res.status(204).end()
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new Reaction()
