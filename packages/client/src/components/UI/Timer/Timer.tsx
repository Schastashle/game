import { FC, useEffect, useMemo, useRef, useState } from 'react'
import style from './timer.module.css'
import { ITimerProps } from './types'
import { useDispatch } from 'react-redux'
import { gameSliceActions } from '../../../store/slices/gameSlice'
import img from '../../../assets/timer.png'

/** Таймер */
export const Timer: FC<ITimerProps> = props => {
  const { initialSeconds } = props
  const dispatch = useDispatch()
  const [seconds, setSeconds] = useState(initialSeconds)
  // счетчик для сброса таймера
  const counter = useRef(seconds)

  const time = useMemo(() => {
    const timeFromDate = new Date(seconds * 1000)

    const newMinutes = timeFromDate.getMinutes()
    const newSeconds = timeFromDate.getSeconds()

    return `${newMinutes < 10 ? `0${newMinutes}` : newMinutes}:${
      newSeconds < 10 ? `0${newSeconds}` : newSeconds
    }`
  }, [seconds])

  useEffect(() => {
    const idInterval = setInterval(() => {
      if (counter.current > 0) {
        setSeconds(prevState => {
          if (prevState > 0) {
            dispatch(gameSliceActions.setTimer(prevState - 1))

            return prevState - 1
          }

          return prevState
        })
      }
    }, 1000)

    return () => {
      clearInterval(idInterval)
    }
  }, [])

  return (
    <div className={style.block}>
      <div className={style.imgBlock}>
        <img src={img} alt={''} />
      </div>

      <div className={style.time}>{time}</div>
    </div>
  )
}

export default Timer
