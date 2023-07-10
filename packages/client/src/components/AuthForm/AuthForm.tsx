import { FC, FormHTMLAttributes } from 'react'
import { Button, LinkItem, Input } from '../UI'
import { FieldValues, useForm } from 'react-hook-form'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { signinUser, signupUser } from '../../store/slices/userSlice'

import style from './authform.module.css'

export interface IAuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title: string
  linkTo: string
  linkText: string
  inputs: Record<string, string>[]
}
const AuthForm: FC<IAuthFormProps> = ({ title, linkTo, linkText, inputs }) => {
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm<FieldValues>()

  const onsubmit = handleSubmit((data: any) => {
    if (linkTo.includes('signup')) {
      dispatch(signinUser(data))
    } else {
      dispatch(signupUser(data))
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
