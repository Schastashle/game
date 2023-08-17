import { FC, memo, useCallback } from 'react'
import style from './profile-list.module.css'
import { Button, Input } from '../../../../components'
import { IUser } from '../../../../types/IUser'
import { useNavigate } from 'react-router-dom'

interface IProfileList {
  profile?: IUser | null
  toggle: () => void
}
const ProfileList: FC<IProfileList> = ({ profile, toggle }) => {
  console.info('ProfileList')

  const navigate = useNavigate()
  const back = useCallback(() => {
    navigate(-1)
  }, [])

  return (
    <div className={style.list}>
      <Input
        name="first_name"
        label="Имя"
        type="text"
        placeholder={profile?.first_name}
        disabled
        underline
      />
      <Input
        name="second_name"
        label="Фамилия"
        type="text"
        placeholder={profile?.second_name}
        disabled
        underline
      />
      <Input
        name="login"
        label="Логин"
        type="text"
        placeholder={profile?.login}
        disabled
        underline
      />
      <Input
        name="email"
        label="Email"
        type="email"
        placeholder={profile?.email}
        disabled
        underline
      />
      <Input
        name="phone"
        label="Телефон"
        type="phone"
        placeholder={profile?.phone}
        disabled
        underline
      />
      <Button onClick={toggle}>Изменить пароль</Button>
      <Button onClick={back} transparent>
        Назад
      </Button>
    </div>
  )
}

export default ProfileList
