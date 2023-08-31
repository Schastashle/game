// const BASE_URL = 'https://ya-praktikum.tech'
// export const API_ROOT = `${BASE_URL}/api/v2`

// редирект на локальный сервер с которого идут все запросы на API
const __SERVER_PORT__ = import.meta.env.VITE_SERVER_PORT
export const SERVER_URL = `http://localhost:${__SERVER_PORT__}`

export const API_ROOT = `${SERVER_URL}/api/v2`
