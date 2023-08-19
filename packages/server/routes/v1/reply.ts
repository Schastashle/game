import { Router } from 'express'
import Reply from '../../controllers/Reply'
import { BASE_URL } from '../../constants'
import type { IReply } from '../../controllers/types'
import type ReplyModel from '../../models/Reply.model'

const router = Router()
const LOCAL_URL = `${BASE_URL}/reply`

router.post(LOCAL_URL, async (req, res) => {
  const {
    author_id = null,
    comment_id = null,
    reply_id = null,
    text,
  } = req.body

  if (!(author_id && text && (comment_id || reply_id))) {
    return res
      .status(400)
      .send(
        'Properties author_id and text are required. At least one of the comment_id and reply_id properties must be sent.'
      )
  }

  const reply = await new Reply({
    author_id,
    comment_id,
    reply_id,
    text,
  }).createReply()

  res.json(reply)
  return
})

router.put(LOCAL_URL, async (req, res) => {
  const { reply_id, text } = req.body

  if (!(reply_id && text))
    return res.status(400).send('Properties reply_id and text are required.')

  const reply = await new Reply({ id: reply_id }).getReplyById()

  ;(reply as IReply).text = text
  await (reply as ReplyModel).save()

  res.json({ success: true, message: 'OK' })
  return
})

export default router
