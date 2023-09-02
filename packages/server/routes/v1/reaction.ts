import { Router } from 'express'
import Reaction from '../../controllers/Reaction'
import { BASE_URL } from '../../constants'

const router = Router()
const LOCAL_URL = `${BASE_URL}/reactions`

router.post(LOCAL_URL, Reaction.create)
router.get(`${LOCAL_URL}/:id`, Reaction.getById)
router.delete(`${LOCAL_URL}/:id`, Reaction.delete)

export default router
