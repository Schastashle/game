import axios from 'axios'

const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
const API_ROOT = `${REDIRECT_URI}/api/v2`

// Получаем service_id и записываем его в переменную,
// которую подставляем в ссылку кнопки
export const getServiceId = async () => {
  try {
    const response = await fetch(
      `${API_ROOT}/oauth/yandex/service-id?redirect_uri=${REDIRECT_URI}`
    )
    const data = await response.json()

    return data.service_id
  } catch (error) {
    console.error(error)
  }
}

export const loginWithCode = async (code: string) => {
  try {
    // Отправляем запрос на авторизацию с кодом и url для редиректа
    const response = await axios.post(`${API_ROOT}/oauth/yandex`, {
      code,
      redirect_uri: `${REDIRECT_URI}`,
    })

    return response
  } catch (error) {
    console.error(error)
  }
}
