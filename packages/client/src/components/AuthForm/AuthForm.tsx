import axios from 'axios'
import { FC, FormHTMLAttributes, useContext } from 'react'
import { Button, LinkItem, Input } from '../UI'
import { FieldValues, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../../App'

import style from './authform.module.css'

export interface IAuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title: string
  linkTo: string
  linkText: string
  inputs: Record<string, string>[]
}
const AuthForm: FC<IAuthFormProps> = ({ title, linkTo, linkText, inputs }) => {
  const navigate = useNavigate()

  const { setAuth } = useContext(MyContext)

  const { register, handleSubmit } = useForm<FieldValues>()

  const onsubmit = handleSubmit(async data => {
    if (linkTo.includes('signup')) {
      axios
        .post('https://ya-praktikum.tech/api/v2/auth/signin', data, {
          withCredentials: true,
        })
        .then(response => {
          console.log(response)
          setAuth(true)
          return navigate('/')
        })
        .catch(err => {
          console.error('err', err)
          setAuth(false)
          return navigate('/signin')
        })
    } else {
      axios
        .post('https://ya-praktikum.tech/api/v2/auth/signup', data, {
          withCredentials: true,
        })
        .then(response => {
          console.log(response)
          setAuth(true)
          return navigate('/')
        })
        .catch(err => {
          console.error('err', err)
          setAuth(false)
          return navigate('/signup')
        })
    }
  })

  return (
    <form className={style.form} onSubmit={onsubmit}>
      <h1 className={style.title}>{title}</h1>
      {inputs.map(({ name, type, placeholder }) => (
        <Input
          key={name}
          name={name}
          type={type}
          placeholder={placeholder}
          register={register}
        />
      ))}
      <Button type="submit">Отправить</Button>
      <LinkItem to={linkTo} text={linkText} />
    </form>
  )
}

export default AuthForm
