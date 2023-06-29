import { FC } from 'react'
import style from './signin.module.css'
import { Input, Button } from '../../components/UI'

const Signin: FC = () => {
  return (
    <section className={style.signin}>
      <form className={style.form}>
        <h1 className={style.title}>Войти</h1>
        <div className={style.field}>
          <Input error="error" placeholder="Логин" type="text" />
        </div>
        <div className={style.field}>
          <Input error="error" placeholder="Пароль" type="password" />
        </div>
        <div className={style.btn}>
          <Button>Отправить</Button>
        </div>
      </form>
    </section>
  )
}

export default Signin
