import { FC, useState, useEffect } from 'react'
import style from './profile.module.css'
import { useAppSelector } from '../../hooks/reduxHooks'
import { IUser } from '../../types/IUser'
import { AvatarForm, PasswordForm, ProfileList } from './components'

const Profile: FC = () => {
  const [profile, setProfile] = useState({} as IUser)
  const [isPasswordBeingEdited, setIsPasswordBeingEdited] = useState(false)

  const { user } = useAppSelector(state => state.user)

  useEffect(() => {
    if (user) {
      setProfile(user)
    }
  }, [profile])

  const handleTogglePasswordEdit = () => {
    setIsPasswordBeingEdited(!isPasswordBeingEdited)
  }

  return (
    <div className={style.profile}>
      <main className={style.content}>
        <AvatarForm profile={profile} disabled={isPasswordBeingEdited} />
        {isPasswordBeingEdited ? (
          <PasswordForm toggle={handleTogglePasswordEdit} />
        ) : (
          <ProfileList toggle={handleTogglePasswordEdit} profile={profile} />
        )}
      </main>
    </div>
  )
}

export default Profile
