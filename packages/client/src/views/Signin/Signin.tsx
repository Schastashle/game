import { FC } from 'react'
import style from './signin.module.css'
import { AuthForm, Input } from '../../components/UI'

const Signin: FC = () => {
  return (
    <section className={style.signin}>
      <AuthForm title="Регистрация" linkTo="/signup" linkText="Регистрация">
        <Input placeholder="Логин" type="text" name="login" />
        <Input placeholder="Пароль" type="password" name="password" />
      </AuthForm>
    </section>
  )
}

export default Signin
