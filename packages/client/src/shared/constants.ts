// const BASE_URL = 'https://ya-praktikum.tech'
// export const API_ROOT = `${BASE_URL}/api/v2`

// редирект на локальный сервер с которого идут все запросы на API
const __SERVER_PORT__ = import.meta.env.VITE_SERVER_PORT
export const SERVER_URL = `http://localhost:${__SERVER_PORT__}`

export const API_ROOT = `${SERVER_URL}/api/v2`

export const THIS_URL = import.meta.env.VITE_REDIRECT_URI

export const OAUTH_URL = `${API_ROOT}/oauth/yandex`

export const OAUTH_GET_SERVICE_ID_URL = `${OAUTH_URL}/service-id?redirect_uri=${THIS_URL}`

export function getOAuthProviderPageUrl(serviceId: string) {
  return `https://oauth.yandex.ru/authorize?response_type=code&client_id=${serviceId}&redirect_uri=${THIS_URL}`
}
