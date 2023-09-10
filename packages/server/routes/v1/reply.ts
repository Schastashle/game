import { Router } from 'express'
import { FORUM_PATH } from '../../constants'
import Reply from '../../controllers/Reply'

const router = Router()
const LOCAL_URL = `${FORUM_PATH}/reply`

router.post(LOCAL_URL, async (req, res) => {
  const { author_id = null, comment_id = null, text } = req.body

  if (!(author_id && text && comment_id)) {
    return res
      .status(400)
      .send('Properties author_id, comment_id and text are required.')
  }

  const reply = await new Reply({
    author_id,
    comment_id,
    text,
  }).createReply()

  res.json(reply)

  return
})

router.put(LOCAL_URL, async (req, res) => {
  try {
    const { id, text } = req.body

    if (!(id && text)) {
      return res.status(400).send('Properties reply_id and text are required.')
    }

    const reply = await new Reply({ id }).updateReply(text)

    res.json(reply)
  } catch (error) {
    res.json(error)
  }

  return
})

router.delete(LOCAL_URL, async (req, res) => {
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).send('id is required')
    }

    const reply = await new Reply({ id }).deleteReply()

    res.json(reply)
  } catch (error) {
    res.json(error)
  }

  return
})

export default router
