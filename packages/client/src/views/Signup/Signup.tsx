import { FC } from 'react'
import style from './signup.module.css'
import { AuthForm } from '../../components/UI'
const Signup: FC = () => {
  const inputs = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'email',
    },
    {
      name: 'first_name',
      type: 'text',
      placeholder: 'Имя',
    },
    {
      name: 'last_name',
      type: 'text',
      placeholder: 'Фамилия',
    },
    {
      name: 'phone',
      type: 'phone',
      placeholder: 'Телефон',
    },
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
    {
      name: 'confirm_password',
      type: 'password',
      placeholder: 'Подтвердите пароль',
    },
  ]

  return (
    <main className={style.signup}>
      <AuthForm
        title="Регистрация"
        linkTo="/signin"
        linkText="Войти"
        inputs={inputs}
      />
    </main>
  )
}

export default Signup
