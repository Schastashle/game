import { FC, memo } from 'react'
import { AvatarType, EAvatarSize } from './types'
import style from './avatar.module.css'
import Img from '../../../assets/ava_default.jpeg'

const Avatar: FC<AvatarType> = props => {
  const { src, size = 'medium' } = props

  return (
    <div
      className={style.block}
      style={{
        width: EAvatarSize[size],
        height: EAvatarSize[size],
      }}>
      <img src={src || Img} alt="аватар" className={style.img} />
    </div>
  )
}

export default memo(Avatar)
