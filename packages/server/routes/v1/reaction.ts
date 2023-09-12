import { Router } from 'express'
import Reaction from '../../controllers/Reaction'
import { FORUM_PATH } from '../../constants'

const router = Router()
const LOCAL_URL = `${FORUM_PATH}/reactions`

router.post(LOCAL_URL, Reaction.create)
router.get(`${LOCAL_URL}/:id`, Reaction.getById)
router.delete(`${LOCAL_URL}/:id`, Reaction.delete)

export default router
