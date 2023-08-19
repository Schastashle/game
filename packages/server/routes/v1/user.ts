import { Router } from 'express'
import { BASE_URL } from '../../constants'
import User from '../../controllers/User'
import removeSpecialCharacters from '../../utils/removeSpecialCharacters'

const router = Router()

router.get(`${BASE_URL}/user`, async (req, res) => {
  const { id, name } = req.query

  if (!(id && name))
    return res.status(400).send('Params id and name are required.')

  const user = await new User({
    id: id as unknown as number,
    name: removeSpecialCharacters(name as string),
  }).getUser()

  res.json(user)
  return
})

export default router
