import { FC, useEffect } from 'react'
import style from './signin.module.css'
import { INPUTS } from './constants'
import { useNavigate } from 'react-router-dom'
import { AuthForm } from '../../components'
import { SignInSchema } from '../../schemas'

interface ISignin {
  isAuth: boolean
}

const Signin: FC<ISignin> = ({ isAuth }) => {
  const navigate = useNavigate()

  useEffect(() => {
    isAuth ? navigate('/') : ''
  }, [isAuth])

  return (
    <section className={style.signin}>
      <AuthForm
        title="Войти"
        linkTo="/signup"
        linkText="Регистрация"
        inputs={INPUTS}
        schema={SignInSchema}
      />
    </section>
  )
}

export default Signin
