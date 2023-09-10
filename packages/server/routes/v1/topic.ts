import { Router } from 'express'
import { FORUM_PATH } from '../../constants'
import Topic from '../../controllers/Topic'
import User from '../../controllers/User'
import removeSpecialCharacters from '../../utils/removeSpecialCharacters'

const router = Router()
const LOCAL_URL = `${FORUM_PATH}/topic`

router.get(LOCAL_URL, async (req, res) => {
  const id: number | unknown = req.query?.id

  if (!id) return res.status(400).send('Param id is required.')

  const topic = await new Topic(id as number).getTopic()

  res.json({
    topic,
  })

  return
})

router.get(`${FORUM_PATH}/topics`, async (_req, res) => {
  const topics = await new Topic(null).getTopics()

  res.json(topics)
})

router.post(LOCAL_URL, async (req, res) => {
  const { name, author_id, author_name } = req.body

  if (!(name && author_id && author_name)) {
    return res
      .status(400)
      .send('Properties name, author_id and author_name are required.')
  }

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
  try {
    const { id } = req.body

    if (!id) return res.status(400).send('Param id is required.')

    const topic = new Topic(id)

    if (!topic) return res.json("Topic wasn't found.")

    await topic.remove()
    res.json('OK')
  } catch (error) {
    res.json(error)
  }

  return
})

export default router
