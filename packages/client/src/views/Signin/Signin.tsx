import { FC } from 'react'
import style from './signin.module.css'
import { AuthForm } from '../../components/UI'

export interface IFormData {
  login: string
  password: string
}

const Signin: FC = () => {
  const inputs = [
    {
      name: 'login',
      type: 'text',
      placeholder: 'Логин',
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Пароль',
    },
  ]

  return (
    <section className={style.signin}>
      <AuthForm
        title="Войти"
        linkTo="/signup"
        linkText="Регистрация"
        inputs={inputs}
      />
    </section>
  )
}

export default Signin
