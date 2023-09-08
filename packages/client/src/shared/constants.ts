// редирект на локальный сервер с которого идут все запросы на API
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://host.docker.internal:3000'

export const API_ROOT = `${SERVER_URL}/api/v2`
