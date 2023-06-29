import { FC, ReactNode } from 'react'
import style from './authform.module.css'
import Button from '../Button'
import LinkItem from '../LinkItem/LinkItem'

interface AuthFormProps {
  title: string
  children: ReactNode
  linkTo: string
  linkText: string
}
const AuthForm: FC<AuthFormProps> = ({ title, children, linkTo, linkText }) => {
  return (
    <form className={style.form} onSubmit={event => event.preventDefault()}>
      <h1 className={style.title}>{title}</h1>
      {children}
      <Button type="submit">Отправить</Button>
      <LinkItem to={linkTo} text={linkText} />
    </form>
  )
}

export default AuthForm
