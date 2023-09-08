import dotenv from 'dotenv'

dotenv.config()

// редирект на локальный сервер с которого идут все запросы на API
export const SERVER_URL = process.env.SERVER_URL || `http://localhost:3000`

export const API_ROOT = `${SERVER_URL}/api/v2`
