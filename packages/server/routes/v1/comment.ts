import { Router } from 'express'
import Comment from '../../controllers/Comment'
import Reply from '../../controllers/Reply'
import removeSpecialCharacters from '../../utils/removeSpecialCharacters'

import { BASE_URL } from '../../constants'
import type { IReply } from '../../controllers/types'

const router = Router()
const LOCAL_URL = `${BASE_URL}/comment`

router.get(`${BASE_URL}/comments`, async (req, res) => {
  const { topic_id } = req.query

  if (!topic_id) return res.status(400).send('Param topic_id is required.')

  const comments = await new Comment({
    topic_id: topic_id as unknown as number,
  }).getCommentsByTopic()

  if (!comments) return res.json([])

  const mappedComments = await Promise.all(
    comments.map(async comment => {
      comment.replies = await Promise.all(
        (comment.replies as (number | IReply)[]).map(async (reply, index) => {
          if (index < 5) {
            return (await new Reply({
              id: reply as number,
            }).getReplyById()) as IReply
          } else {
            return reply
          }
        })
      )

      return comment
    })
  )

  res.json(mappedComments)
  return
})

router.post(LOCAL_URL, async (req, res) => {
  const { topic_id, author_id, text } = req.body

  if (!(topic_id && author_id && text))
    return res
      .status(400)
      .send('Properties topic_id, author_id and text are required.')

  const comment = await new Comment({
    topic_id,
    author_id,
    text: removeSpecialCharacters(text),
  }).createComment()

  res.json(comment)
  return
})

router.put(LOCAL_URL, async (req, res) => {
  const { comment_id, value } = req.body

  if (!value) return res.status(400).send('Property value is required.')

  const updatedComment = await new Comment({
    id: comment_id,
  }).updateCommentById(value)

  res.json(updatedComment)
  return
})

router.delete(LOCAL_URL, async (req, res) => {
  const { id } = req.body

  if (!id) return res.status(400).send('Property id is required.')

  const comment = new Comment({ id })
  const response = await comment.remove()

  res.json(response)
  return
})

export default router
