import { FC } from 'react'
import { NavLink } from 'react-router-dom'
import style from './errorPage.module.css'

export interface IErrorPageProps {
  status?: number
}

const getMessage = function (status: number) {
  switch (status) {
    case 404:
      return 'Страница не найдена'
    default:
      return 'Ошибка при загрузке страницы'
  }
}

/** Страница с статусом ошибки 404/500 */
const ErrorPage: FC<IErrorPageProps> = props => {
  const { status = 500 } = props

  return (
    <div className={style.block}>
      <div color={style.wrapper}>
        <h1 className={style.statusText}>{status}</h1>

        <h2 className={style.message}>{getMessage(status)}</h2>

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
