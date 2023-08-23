import { sequelize } from '../db'
import Models from '../models'

export default {
  init() {
    sequelize.addModels(Models)
  },
}
