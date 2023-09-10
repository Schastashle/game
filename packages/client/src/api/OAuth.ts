import axios from 'axios'
import {
  OAUTH_GET_SERVICE_ID_URL,
  OAUTH_URL,
  THIS_URL,
  getOAuthProviderPageUrl,
} from '../shared/constants'

//const API_ROOT = `${REDIRECT_URI}/api/v2`

// Получаем service_id и записываем его в переменную,
// которую подставляем в ссылку кнопки
const getServiceId = async () => {
  try {
    const response = await fetch(OAUTH_GET_SERVICE_ID_URL)
    const data = await response.json()

    return data.service_id
  } catch (error) {
    console.error(error)
  }
}

const loginWithCode = async (code: string) => {
  try {
    // Отправляем запрос на авторизацию с кодом и url для редиректа
    const response = await axios.post(OAUTH_URL, {
      code,
      redirect_uri: `${THIS_URL}`,
    })

    return response
  } catch (error) {
    console.error(error)
  }
}

export { getOAuthProviderPageUrl, getServiceId, loginWithCode }
