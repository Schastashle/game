import { FC, useCallback } from 'react'
import style from './oauth.module.css'
import { getServiceId } from '../../api/OAuth'
import { SERVER_URL } from '../../shared/constants'

const REDIRECT_URI = SERVER_URL

const OAuth: FC = () => {
  const handleLogin = useCallback(async () => {
    const serviceId = await getServiceId()
    window.location.replace(
      `https://oauth.yandex.ru/authorize?response_type=code&client_id=${serviceId}&redirect_uri=${REDIRECT_URI}`
    )
  }, [])

  return (
    <div className={style.container}>
      <div className={style.divider}>или</div>

      <a href="#" onClick={handleLogin} className={style['oauth-provider']}>
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
