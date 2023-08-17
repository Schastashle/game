import { FC } from 'react'
import style from './password-form.module.css'
import { Button, Input } from '../../../../components'
import axios, { AxiosError } from 'axios'
import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordSchema } from '../../../../schemas'

interface IPasswordForm {
  toggle: () => void
}
const PasswordForm: FC<IPasswordForm> = ({ toggle }) => {
  console.info('PasswordForm')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ resolver: zodResolver(PasswordSchema) })

  const onSubmit = handleSubmit(async (data: FieldValues) => {
    const isOk = await sendPass(data)
    if (isOk) toggle()
  })

  // без autoComplete="username" получаем сообщение от хрома Password forms should have (optionally hidden) username fields for accessibility
  return (
    <>
      <form className={style.list} onSubmit={onSubmit}>
        <input hidden type="text" autoComplete="username" />
        <Input
          name="oldPassword"
          type="password"
          label="Старый пароль"
          autoComplete="current-password"
          register={register}
          error={errors.oldPassword?.message as string}
          underline
        />
        <Input
          name="newPassword"
          type="password"
          label="Пароль"
          autoComplete="new-password"
          register={register}
          error={errors.newPassword?.message as string}
          underline
        />
        <Input
          name="confirmPassword"
          type="password"
          label="Подтвердите пароль"
          autoComplete="new-password"
          register={register}
          error={errors.confirmPassword?.message as string}
          underline
        />
        <Button type="submit">Сохранить пароль</Button>
      </form>
      <Button type="button" transparent onClick={toggle}>
        Отмена
      </Button>
    </>
  )
}

async function sendPass(data: FieldValues) {
  const { oldPassword, newPassword } = data
  let isOk = false
  try {
    await axios.put(
      `https://ya-praktikum.tech/api/v2/user/password`,
      {
        oldPassword,
        newPassword,
      },
      { withCredentials: true }
    )
    isOk = true
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.data.reason === 'Password is incorrect'
    ) {
      console.log('Неправильный пароль')
    } else {
      throw error
    }
  }
  return isOk
}

// тут с memo не получилось, может быть useForm что-то делает
export default PasswordForm
