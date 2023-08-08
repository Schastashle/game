import { FC } from 'react'
import style from './counter.module.css'
import img from '../../../assets/counter.png'
import { ICounterProps } from './types'

/** Очки */
export const Counter: FC<ICounterProps> = props => {
  const { target, counts } = props

  return (
    <div className={style.block}>
      <div className={style.imgBlock}>
        <img src={img} alt={''} />
      </div>

      <div className={style.counter}>
        {counts}/{target}
      </div>
    </div>
  )
}

export default Counter
