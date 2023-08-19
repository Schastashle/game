import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppDispatch } from '../../hooks/reduxHooks'
import axios from 'axios'
import style from './oauth.module.css'
import { getUser } from '../../store/slices/userSlice'
import {
  YANDEX_SERVICE_ID,
  YANDEX_OAUTH,
  REDIRECT_URI,
} from '../../../constants/oauth'

const OAuth: FC = () => {
  const [serviceId, setServiceId] = useState('')
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    // Получаем service_id и записываем его в переменную,
    // которую подставляем в ссылку кнопки
    const getServiceId = async () => {
      try {
        const response = await fetch(YANDEX_SERVICE_ID)
        return await response.json()
      } catch (error) {
        console.error(error)
      }
    }

    getServiceId().then(({ service_id = '' }: { service_id: string }) => {
      setServiceId(service_id)
    })

    // Получаем из параметров url код, который получаем после перехода
    // на страницу авторизации через OAuth Яндекса
    const queryString = location.state.from.search
    const urlParams = new URLSearchParams(queryString)
    const code = urlParams.get('code')

    const onAuth = async () => {
      try {
        // Отправляем запрос на авторизацию с кодом и url для редиректа
        const data = await axios
          .post(YANDEX_OAUTH, {
            code,
            redirect_uri: REDIRECT_URI,
          })
          .then(res => res.data || null)

        // Если запрос возвращает ответ и он равен OK,
        // то отправляем запрос на получение данных о пользователе
        if (data && data === 'OK') {
          dispatch(getUser())
        }
      } catch (error) {
        console.error(error)
      }
    }

    // Отправляем запрос на авторизацию только если есть код,
    // получаемый при переходе на сервис Янедкс для авторизации
    if (code) {
      onAuth()
    }
  }, [])

  return (
    <div className={style.container}>
      <div className={style.divider}>или</div>

      <a
        href={`https://oauth.yandex.ru/authorize?response_type=code&client_id=${serviceId}&redirect_uri=http://localhost:3000`}
        className={style['oauth-provider']}>
        <svg
          width="32px"
          height="32px"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.88,2h-4c-4,0-8.07,3-8.07,9.62a8.33,8.33,0,0,0,4.14,7.66L9,28.13A1.25,1.25,0,0,0,9,29.4a1.21,1.21,0,0,0,1,.6h2.49a1.24,1.24,0,0,0,1.2-.75l4.59-9h.34v8.62A1.14,1.14,0,0,0,19.82,30H22a1.12,1.12,0,0,0,1.16-1.06V3.22A1.19,1.19,0,0,0,22,2ZM18.7,16.28h-.59c-2.3,0-3.66-1.87-3.66-5,0-3.9,1.73-5.29,3.34-5.29h.94Z"
            fill="#d61e3b"
          />
        </svg>
      </a>
    </div>
  )
}

export default OAuth
