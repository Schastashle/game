import { FC, useState, useEffect, useCallback, memo } from 'react'
import style from './profile.module.css'
import { useAppSelector } from '../../hooks/reduxHooks'
import { AvatarForm, PasswordForm, ProfileList } from './components'

const Profile: FC = () => {
  const [showPass, setIsPasswordBeingEdited] = useState(false)

  const user = useAppSelector(state => state.user.user)

  const handleTogglePasswordEdit = useCallback(() => {
    setIsPasswordBeingEdited(oldValue => !oldValue)
  }, [])

  console.info('*************')
  console.info('render Profile', user, showPass)

  return (
    <div className={style.profile}>
      <main className={style.content}>
        <AvatarForm avatar={user?.avatar} disabled={showPass} />
        {showPass && <PasswordForm toggle={handleTogglePasswordEdit} />}
        {!showPass && (
          <ProfileList toggle={handleTogglePasswordEdit} profile={user} />
        )}
      </main>
    </div>
  )
}

export default memo(Profile)
