import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { INPUTS } from './constants'
import { AuthForm } from '../../components'
import { SignUpSchema } from '../../schemas'

import style from './signup.module.css'

interface ISignup {
  isAuth: boolean
}

const Signup: FC<ISignup> = ({ isAuth }) => {
  const navigate = useNavigate()

  useEffect(() => {
    isAuth ? navigate('/') : ''
  }, [isAuth])

  return (
    <main className={style.signup}>
      <AuthForm
        title="Регистрация"
        linkTo="/signin"
        linkText="Войти"
        inputs={INPUTS}
        schema={SignUpSchema}
      />
    </main>
  )
}

export default Signup
