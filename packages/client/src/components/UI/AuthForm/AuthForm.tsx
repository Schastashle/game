import { FC, FormHTMLAttributes } from 'react'
import style from './authform.module.css'
import Button from '../Button'
import LinkItem from '../LinkItem/LinkItem'
import Input from '../Input/Input'
import { FieldValues, useForm } from 'react-hook-form'

export interface IAuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title: string
  linkTo: string
  linkText: string
  inputs: Record<string, string>[]
}
const AuthForm: FC<IAuthFormProps> = ({ title, linkTo, linkText, inputs }) => {
  const { register, handleSubmit } = useForm<FieldValues>()

  const onsubmit = handleSubmit(data => {
    console.log(data)
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
