import { FC, FormHTMLAttributes, useCallback, memo } from 'react'
import { Button, LinkItem, Input } from '../UI'
import { FieldValues, useForm } from 'react-hook-form'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { signinUser, signupUser } from '../../store/slices/userSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchemas } from '../../schemas/formValidation'
import { IUserLogin, IUserSignup } from '../../types/IUser'

import style from './authform.module.css'
export interface IAuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title: string
  linkTo: string
  linkText: string
  inputs: {
    name: string
    type: string
    placeholder: string
    autoComplete?: string
  }[]
  schema: LoginSchemas
}
const AuthForm: FC<IAuthFormProps> = ({
  title,
  linkTo,
  linkText,
  inputs,
  schema,
}) => {
  console.log('render AuthForm')
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ resolver: zodResolver(schema) })

  const onSubmit = useCallback(
    handleSubmit((data: FieldValues) => {
      if (linkTo.includes('signup')) {
        dispatch(signinUser(data as IUserLogin))
      } else {
        dispatch(signupUser(data as IUserSignup))
      }
    }),
    []
  )

  return (
    <form className={style.form} onSubmit={onSubmit}>
      <h1 className={style.title}>{title}</h1>
      {inputs.map(({ name, type, placeholder, autoComplete }) => (
        <Input
          key={name}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          register={register}
          error={errors[name]?.message as string}
        />
      ))}
      <Button type="submit">Отправить</Button>
      <LinkItem to={linkTo} text={linkText} />
    </form>
  )
}

export default memo(AuthForm)
