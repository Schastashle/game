import { FC, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import style from './errorPage.module.css'

export interface IErrorPageProps {
  status?: number
}

/** Страница с статусом ошибки 404/500 */
const ErrorPage: FC<IErrorPageProps> = props => {
  const { status = 500 } = props

  const message = useMemo(() => {
    switch (status) {
      case 404:
        return 'Страница не найдена'
      default:
        return 'Ошибка при загрузке страницы'
    }
  }, [status])

  return (
    <div className={style.block}>
      <div color={style.wrapper}>
        <h1 className={style.statusText}>{status}</h1>

        <h2 className={style.message}>{message}</h2>

        <div className={style.buttonBlock}>
          <NavLink to={'/'} className={style.button}>
            Вернутся на главную
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
