import { Router } from 'express'
import UserTheme from '../../models/UserTheme.model'

const router = Router()

const URL = '/api/v1/user-theme'

router.get(`${URL}/:id`, async (req, res) => {
  const user = await UserTheme.findOne({
    where: { user_id: req.params.id },
  })

  if (user && user.app_theme_name) {
    res.status(200).json(user.app_theme_name)
  } else {
    res.status(500)
  }
})

router.post(`${URL}/:id`, async (req, res) => {
  const user = await UserTheme.findOne({
    where: { user_id: req.params.id },
  })

  if (user) {
    const updatedUser = await UserTheme.update(req.body, {
      where: { user_id: req.params.id },
    })

    let status = 500
    let payload

    if (updatedUser) {
      payload = (await UserTheme.findOne({
        where: { user_id: req.params.id },
      })) as UserTheme | null

      status = 200
    }
    res.status(status).json(payload)
  } else {
    const newUser = await UserTheme.create({
      user_id: req.params.id,
      ...req.body,
    })

    res.status(200).json(newUser)
  }
})

export default router
