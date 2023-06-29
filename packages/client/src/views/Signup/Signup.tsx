import style from './signup.module.css'
import { AuthForm, Input } from '../../components/UI'
const Signup = () => {
  return (
    <main className={style.signup}>
      <AuthForm title="Регистрация" linkTo="/signin" linkText="Войти">
        <Input placeholder="email" type="email" name="email" />
        <Input placeholder="Имя" type="text" name="first_name" />
        <Input placeholder="Фамилия" type="text" name="last_name" />
        <Input placeholder="Телефон" type="phone" name="phone" />
        <Input placeholder="Логин" type="text" name="login" />
        <Input placeholder="Пароль" type="password" name="password" />
      </AuthForm>
    </main>
  )
}

export default Signup
