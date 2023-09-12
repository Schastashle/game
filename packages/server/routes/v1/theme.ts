import { Router } from 'express'
import UserTheme from '../../models/UserTheme.model'
import { FIAR_API_PATH } from '../../constants'

const router = Router()

const URL = `${FIAR_API_PATH}/user-theme`

router.get(`${URL}`, async (_, res) => {
  const userId = res.locals.user_id
  if (!userId) throw new Error('Не удалось получить данных по пользователю')

  let user
  try {
    user = await UserTheme.findOne({
      where: { user_id: userId },
    })
  } catch (e) {
    res.status(500).json(e)
  }

  if (user && user.app_theme_name) {
    res.status(200).json(user.app_theme_name)
  } else {
    res.status(404)
  }
})

router.post(`${URL}`, async (req, res) => {
  const userId = res.locals.user_id
  if (!userId) throw new Error('Не удалось получить данных по пользователю')

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
})

export default router
