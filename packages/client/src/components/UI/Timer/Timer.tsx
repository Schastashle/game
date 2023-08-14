import { FC, useEffect, useCallback, useRef, useState } from 'react'
import style from './timer.module.css'
import { ITimerProps } from './types'
import img from '../../../assets/timer.png'

const secToStr = function (sec: number) {
  const newMinutes = Math.floor(Math.floor((sec / 60) % 60))
  const newSeconds = Math.round(Math.floor(sec % 60))

  return `${newMinutes < 10 ? `0${newMinutes}` : newMinutes}:${
    newSeconds < 10 ? `0${newSeconds}` : newSeconds
  }`
}

/** Таймер */
export const Timer: FC<ITimerProps> = props => {
  const { getMSec, played } = props

  const animateRef = useRef<number>(0)
  const secRef = useRef<number>(0)
  const [seconds, setSeconds] = useState(0)

  const animate = useCallback((_t: number, stop?: boolean) => {
    const newSec = Math.round(getMSec(new Date()) / 1000)

    if (newSec >= 0 && secRef.current !== newSec) {
      // newSec > 0, чтобы не уйти в минус, если вдруг таймаут сильно задержится
      secRef.current = newSec
      setSeconds(newSec)
    }

    animateRef.current = stop ? 0 : requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (!animateRef.current && !played) return

    animate(0, !played)

    return () => cancelAnimationFrame(animateRef.current)
  }, [played])

  return (
    <div className={style.block}>
      <div className={style.imgBlock}>
        <img src={img} alt={''} />
      </div>

      <div className={style.time}>{secToStr(seconds)}</div>
    </div>
  )
}

export default Timer
