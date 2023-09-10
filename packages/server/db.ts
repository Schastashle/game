import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import logger from './logger/index'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  POSTGRES_HOST,
} = process.env
const sequelizeOptions: SequelizeOptions = {
  host: POSTGRES_HOST,
  port: POSTGRES_PORT as unknown as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
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
