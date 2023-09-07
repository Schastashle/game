import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import logger from './logger/index'

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } =
  process.env
const sequelizeOptions: SequelizeOptions = {
  host: 'localhost',
  port: (POSTGRES_PORT as unknown as number) || 5432,
  username: POSTGRES_USER || 'postgres',
  password: POSTGRES_PASSWORD || 'postgres',
  database: POSTGRES_DB || 'postgres',
  dialect: 'postgres',
  logging: logger,
}
const sequelize = new Sequelize(sequelizeOptions)

export async function dbConnect() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export { sequelize }
