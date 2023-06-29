import { FC } from 'react'
import style from './signin.module.css'
import { INPUTS } from './constants'
import { AuthForm } from '../../components/UI'
export interface IFormData {
  login: string
  password: string
}

const Signin: FC = () => {
  return (
    <section className={style.signin}>
      <AuthForm
        title="Войти"
        linkTo="/signup"
        linkText="Регистрация"
        inputs={INPUTS}
      />
    </section>
  )
}

export default Signin
