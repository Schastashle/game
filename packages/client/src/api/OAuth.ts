import axios from 'axios'
import { YA_API_URL, PUBLISH_URL } from '../shared/constants'

//const API_ROOT = `${REDIRECT_URI}/api/v2`

const oauthUrl = `${YA_API_URL}/oauth/yandex`

const getServiceIdUrl = `${oauthUrl}/service-id?redirect_uri=${PUBLISH_URL}`

async function getOAuthProviderPageUrl() {
  const serviceId = await getServiceId()

  return `https://oauth.yandex.ru/authorize?response_type=code&client_id=${serviceId}&redirect_uri=${PUBLISH_URL}`
}

// Получаем service_id и записываем его в переменную,
// которую подставляем в ссылку кнопки
const getServiceId = async () => {
  try {
    const response = await fetch(getServiceIdUrl)
    const data = await response.json()

    return data.service_id
  } catch (error) {
    console.error(error)
  }
}

const loginWithCode = async (code: string) => {
  try {
    // Отправляем запрос на авторизацию с кодом и url для редиректа
    const response = await axios.post(oauthUrl, {
      code,
      redirect_uri: `${PUBLISH_URL}`,
    })

    return response
  } catch (error) {
    console.error(error)
  }
}

export { getOAuthProviderPageUrl, getServiceId, loginWithCode }
