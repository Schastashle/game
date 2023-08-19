import { Router } from 'express'
import { BASE_URL } from '../../constants'
import Topic from '../../controllers/Topic'
import Comment from '../../controllers/Comment'
import User from '../../controllers/User'
import removeSpecialCharacters from '../../utils/removeSpecialCharacters'

const router = Router()
const LOCAL_URL = `${BASE_URL}/topic`

router.get(LOCAL_URL, async (req, res) => {
  const id: number | unknown = req.query?.id

  if (!id) return res.status(400).send('Param id is required.')

  const topic = await new Topic(id as number).getTopicById()
  const comments = await new Comment({
    id: id as unknown as number,
  }).getCommentsByTopic()

  res.json({
    topic,
    comments,
  })
  return
})

router.get(`${BASE_URL}/topics`, async (_req, res) => {
  const topics = await new Topic(null).getTopics()
  res.json(topics)
})

router.post(LOCAL_URL, async (req, res) => {
  const { name, author_id, author_name } = req.body

  if (!(name && author_id))
    return res.status(400).send('Properties name and author_id are required.')

  const topic = await new Topic(null).createTopic(
    removeSpecialCharacters(name),
    Number(author_id)
  )
  const user = await new User({ id: author_id, name: author_name }).getUser()

  res.json({
    topic,
    user,
  })
  return
})

router.delete(LOCAL_URL, async (req, res) => {
  const { id } = req.body

  if (!id) return res.status(400).send('Param id is required.')

  const topic = new Topic(id)

  if (!topic) return res.json("Topic wasn't found.")

  await topic.remove()
  res.json('OK')
  return
})

export default router
