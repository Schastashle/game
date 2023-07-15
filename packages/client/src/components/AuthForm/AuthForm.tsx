import axios from 'axios'
import { FC, FormHTMLAttributes, useCallback, useContext } from 'react'
import { Button, LinkItem, Input } from '../UI'
import { FieldValues, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../../App'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchemas } from '../../schemas/formValidation'

import style from './authform.module.css'
export interface IAuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title: string
  linkTo: string
  linkText: string
  inputs: { name: string; type: string; placeholder: string }[]
  schema: LoginSchemas
}
const AuthForm: FC<IAuthFormProps> = ({
  title,
  linkTo,
  linkText,
  inputs,
  schema,
}) => {
  const navigate = useNavigate()

  const { setAuth } = useContext(MyContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ resolver: zodResolver(schema) })

  const onSubmit = useCallback((data: FieldValues) => {
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
  }, [])

  return (
    <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={style.title}>{title}</h1>
      {inputs.map(({ name, type, placeholder }) => (
        <Input
          key={name}
          name={name}
          type={type}
          placeholder={placeholder}
          register={register}
          error={errors[name]?.message as string}
        />
      ))}
      <Button type="submit">Отправить</Button>
      <LinkItem to={linkTo} text={linkText} />
    </form>
  )
}

export default AuthForm
