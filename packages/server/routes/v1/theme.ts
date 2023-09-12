import { Router } from 'express'
import UserTheme from '../../models/UserTheme.model'

const router = Router()

const URL = '/api/v1/user-theme'

router.get(`${URL}`, async (_, res) => {
  const userId = res.locals.user_id

  if (userId) {
    const user = await UserTheme.findOne({
      where: { user_id: userId },
    })

    if (user && user.app_theme_name) {
      res.status(200).json(user.app_theme_name)
    } else {
      res.status(404)
    }
  } else {
    res.status(200)
  }
})

router.post(`${URL}`, async (req, res) => {
  const userId = res.locals.user_id

  if (!userId) {
    res.status(200)
  } else {
    try {
      const [instance, created] = await UserTheme.upsert({
        user_id: Number(userId),
        ...req.body,
      })

      if (created) {
        res.status(201).json(instance)
      } else {
        res.status(202).json(instance)
      }
    } catch (e) {
      res.status(500).json(e)
    }
  }
})

export default router
