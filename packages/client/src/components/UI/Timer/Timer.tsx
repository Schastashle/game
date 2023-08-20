import {
  FC,
  useEffect,
  useCallback,
  useRef,
  useState,
  useTransition,
} from 'react'
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

const animate = function (
  ref: React.MutableRefObject<number>,
  func: () => void
) {
  cancelAnimationFrame(ref.current)
  func()

  ref.current = requestAnimationFrame(animate.bind(null, ref, func))
}

/** Таймер */
export const Timer: FC<ITimerProps> = props => {
  const { getMSec, played } = props

  const animateRef = useRef<number>(0)
  const secRef = useRef<number>(0)
  const [seconds, setSeconds] = useState(0)
  const [isPending, startTransition] = useTransition()
  const prevPlayed = useRef(false)

  const updateSeconds = useCallback(() => {
    const newSec = Math.round(getMSec(new Date()) / 1000)

    if (newSec >= 0 && secRef.current !== newSec) {
      // newSec > 0, чтобы не уйти в минус, если вдруг таймаут сильно задержится
      secRef.current = newSec

      startTransition(() => {
        setSeconds(newSec)
      })
    }
  }, [])

  useEffect(() => {
    if (prevPlayed.current) updateSeconds() // тикнем последний раз
    prevPlayed.current = played

    if (!played) return

    animate(animateRef, updateSeconds)

    return () => {
      cancelAnimationFrame(animateRef.current)
    }
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
