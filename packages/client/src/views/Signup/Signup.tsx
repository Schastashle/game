import { FC } from 'react'
import style from './signup.module.css'
import { INPUTS } from './constants'
import { AuthForm } from '../../components/UI'
const Signup: FC = () => {
  return (
    <main className={style.signup}>
      <AuthForm
        title="Регистрация"
        linkTo="/signin"
        linkText="Войти"
        inputs={INPUTS}
      />
    </main>
  )
}

export default Signup
