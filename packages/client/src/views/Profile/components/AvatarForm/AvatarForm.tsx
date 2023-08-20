import { FC, memo } from 'react'
import style from './avatar-form.module.css'
import { Avatar, Button, Dialog } from '../../../../components'
import { FieldValues, useForm } from 'react-hook-form'
import axios from 'axios'
import { useAppDispatch } from '../../../../hooks/reduxHooks'
import { getUser } from '../../../../store/slices/userSlice'
import { API_ROOT } from '../../../../shared/constants'
import { useDialog } from '../../../../components/UI/Dialog/bll'

interface IAvatarForm {
  disabled: boolean
  avatar?: string
}

const AvatarForm: FC<IAvatarForm> = ({ disabled, avatar }) => {
  const { isActive, onOpen, onClose } = useDialog()

  return (
    <>
      <Button type="button" onClick={onOpen} transparent disabled={disabled}>
        <Avatar
          src={`${avatar ? `${API_ROOT}/resources${avatar}` : ''}`}
          size="xl"
        />
      </Button>

      <AvatarDialog isActive={isActive} onClose={onClose} />
    </>
  )
}

type DialogProps = {
  isActive: boolean
  onClose: () => void
}
const AvatarDialog: FC<DialogProps> = memo(({ isActive, onClose }) => {
  const dispatch = useAppDispatch()

  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data: FieldValues) => {
    const isOk = await sendAvatar(data)
    if (isOk) {
      dispatch(getUser())
      reset()
      onClose()
    }
  }

  return (
    <Dialog open={isActive} onClose={onClose}>
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
        <Button type="button" onClick={onClose} transparent>
          Закрыть
        </Button>
      </section>
    </Dialog>
  )
})

async function sendAvatar(data: FieldValues) {
  if (!data.avatar[0]) {
    return false
  }
  const formData = new FormData()
  formData.append('avatar', data.avatar[0])
  let isOk = false
  try {
    await axios.put(`${API_ROOT}/user/profile/avatar`, formData, {
      withCredentials: true,
    })

    isOk = true
  } catch (error) {
    console.log(error)
  }
  return isOk
}

export default memo(AvatarForm)
