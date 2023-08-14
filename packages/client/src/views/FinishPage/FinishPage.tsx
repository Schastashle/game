import styles from './finish.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { gameSliceActions } from '../../store/slices/gameSlice'
import { GameResult } from '../../types/GameState'
import SVGSpinner from '../../components/SVGSpinner/SVGSpinner'

const FinishPage = () => {
  const gameResult = useSelector<any>(
    state => state.game.gameResult
  ) as GameResult
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onComplete = useCallback(() => {
    navigate('/game')

    dispatch(gameSliceActions.reset())
  }, [])

  const onExit = useCallback(() => {
    navigate('/')

    dispatch(gameSliceActions.reset())
  }, [])

  return (
    <section className={styles.finish}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <SVGSpinner />
        </div>
        <h1 className={styles.title}>
          {gameResult.winner ? 'Поздравляем!' : 'В этот раз не удалось'}
        </h1>
        {gameResult.winner && (
          <>
            <p className={styles.text}>Ваш счет:</p>
            <p className={styles.count}>{gameResult.counts}</p>
          </>
        )}

        <button className={styles.start} onClick={onComplete}>
          <svg
            width="56"
            height="65"
            viewBox="0 0 56 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M56 32.5L0.499997 64.9759L0.5 0.0240454L56 32.5Z"
              fill="white"
            />
          </svg>
        </button>
        <button className={styles.exit} onClick={onExit}>
          <svg
            width="45"
            height="45"
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M36.16 22.5H21.1362"
              stroke="white"
              strokeWidth="2.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30.9565 29.3181L37.4999 22.4998L30.9565 15.6816"
              stroke="white"
              strokeWidth="2.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M25.2272 13.125V7.5H7.5V37.5H25.2272V31.875"
              stroke="white"
              strokeWidth="3.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default FinishPage
