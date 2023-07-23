import { FC, useEffect, useState } from 'react'
import style from './avatar-form.module.css'
import { Avatar, Button, Dialog } from '../../../../components'
import { IUser } from '../../../../types/IUser'
import { FieldValues, useForm } from 'react-hook-form'
import axios from 'axios'
import { useAppDispatch } from '../../../../hooks/reduxHooks'
import { getUser } from '../../../../store/slices/userSlice'
import { BASE_URL } from '../../constants'

interface IAvatarForm {
  disabled: boolean
  profile: IUser
}
const AvatarForm: FC<IAvatarForm> = ({ disabled, profile }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [avatar, setAvatar] = useState('')

  const { register, handleSubmit, reset } = useForm()
  const dispatch = useAppDispatch()

  useEffect(() => {
    setAvatar(profile.avatar)
  }, [profile])
  const handleToggleDialog = () => {
    setDialogOpen(!dialogOpen)
  }

  const onSubmit = async (data: FieldValues) => {
    if (!data.avatar[0]) {
      return
    }
    const formData = new FormData()
    formData.append('avatar', data.avatar[0])
    try {
      await axios
        .put(`${BASE_URL}/user/profile/avatar`, formData, {
          withCredentials: true,
        })
        .then(res => {
          if (res.status === 200) {
            setAvatar(res.data.avatar)
            dispatch(getUser())
            reset()
            handleToggleDialog()
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleToggleDialog}
        transparent
        disabled={disabled}>
        <Avatar
          src={`${avatar ? `${BASE_URL}/resources/${avatar}` : ''}`}
          size="xl"
        />
      </Button>
      <Dialog open={dialogOpen}>
        <section className={style.avatarDialog}>
          <h2 className={style.header}>Изменить пароль</h2>
          <form className={style.avatarForm} onSubmit={handleSubmit(onSubmit)}>
            <input
              className={style.input}
              type="file"
              required
              {...register('avatar')}
              id="avatar"
            />
            <Button type="submit">Сохранить</Button>
          </form>
          <Button type="button" onClick={handleToggleDialog} transparent>
            Закрыть
          </Button>
        </section>
      </Dialog>
    </>
  )
}

export default AvatarForm
