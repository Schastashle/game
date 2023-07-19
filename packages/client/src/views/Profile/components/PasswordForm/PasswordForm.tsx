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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ resolver: zodResolver(PasswordSchema) })

  const onSubmit = async (data: FieldValues) => {
    const { oldPassword, newPassword } = data
    try {
      await axios
        .put(
          `https://ya-praktikum.tech/api/v2/user/password`,
          {
            oldPassword,
            newPassword,
          },
          { withCredentials: true }
        )
        .then(() => {
          toggle()
        })
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
  }

  const onCancel = () => {
    toggle()
  }

  return (
    <>
      <form className={style.list} onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="oldPassword"
          type="password"
          label="Старый пароль"
          register={register}
          error={errors.oldPassword?.message as string}
          underline
        />
        <Input
          name="newPassword"
          type="password"
          label="Пароль"
          register={register}
          error={errors.newPassword?.message as string}
          underline
        />
        <Input
          name="confirmPassword"
          type="password"
          label="Подтвердите пароль"
          register={register}
          error={errors.confirmPassword?.message as string}
          underline
        />
        <Button type="submit">Сохранить пароль</Button>
      </form>
      <Button type="button" transparent onClick={onCancel}>
        Отмена
      </Button>
    </>
  )
}

export default PasswordForm
