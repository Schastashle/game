import React, { FC, useCallback, useEffect, useState } from 'react'

import GameAPI from '../../classes/Game/GameAPI'
import { gridParams, cellParams, gems } from './constants'

import styles from './game.module.css'
import { gameSliceActions } from '../../store/slices/gameSlice/index'
import Timer from '../../components/UI/Timer/Timer'
import Counter from '../../components/UI/Counter'
import Dialog from '../../components/UI/Dialog/Dialog'
import Button from '../../components/UI/Button'
import { useDialog } from '../../components/UI/Dialog/bll'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { addUserToLeaderboard } from '../../store/slices/leaderboardSlice'

const gameAPI: GameAPI = new GameAPI(
  gridParams.columns,
  gridParams.rows,
  cellParams,
  gems
)

gameAPI.initialize()

const INTERVAL = 2 * 60
const NUM_GEM = 30

const Game: FC = () => {
  const canvasRef: React.RefObject<HTMLDivElement> = React.createRef()
  const wrapperRef: React.RefObject<HTMLDivElement> = React.createRef()
  const canvas: HTMLCanvasElement = gameAPI.getCanvas()

  const dispatch = useAppDispatch()
  const { timer, counts } = useAppSelector(state => state.game)
  const { user } = useAppSelector(state => state.user)

  const { isActive, onOpen, onClose } = useDialog()
  const navigate = useNavigate()
  const [isFullscreenMode, setIsFullScreen] = useState(false)

  // test
  useEffect(() => {
    canvasRef.current?.appendChild(canvas)

    return () => {
      canvasRef.current?.removeChild(canvas)
    }
  }, [])

  const incCount = useCallback((n: number) => {
    dispatch(gameSliceActions.incCount(n))
  }, [])

  const onSelectGem = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = canvas.getBoundingClientRect()
    const x = event.clientX - left
    const y = event.clientY - top

    gameAPI.trySelectedGem(x, y, incCount)
  }

  const toggleFullscreen = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()

      if (isFullscreenMode) {
        document.exitFullscreen()
      } else {
        wrapperRef.current?.requestFullscreen()
      }

      setIsFullScreen(!isFullscreenMode)
    },
    [canvasRef, isFullscreenMode]
  )

  const onFinished = () => {
    if (user?.login) {
      dispatch(
        addUserToLeaderboard({
          userId: user.id,
          scoresFir: counts,
          userName: user.login,
        })
      )
    }
    navigate('/game/finish')
  }

  useEffect(() => {
    if (timer === 0 || NUM_GEM <= counts) {
      onOpen()
    }
  }, [timer, counts])

  return (
    <div ref={wrapperRef}>
      <div className={styles.header}>
        <div className={styles.timer}>
          <Timer initialSeconds={INTERVAL} />
        </div>

        <div>
          <Counter target={NUM_GEM} />
        </div>

        <div className={styles['game-controls']}>
          <button
            className={styles['button-fullscreen']}
            onClick={toggleFullscreen}>
            Переключить режим просмотра
          </button>
        </div>
      </div>

      <div className={styles.game} ref={canvasRef} onClick={onSelectGem}></div>

      <Dialog
        open={isActive}
        onClose={() => {
          onClose()

          onFinished()
        }}>
        <h2 className={styles.dialogTitle}>
          {counts >= NUM_GEM ? <>Победа</> : <>Поражение</>}
        </h2>

        <p className={styles.dialogCounts}>Cчет: {counts}</p>

        <div className={styles.dialogBtnBlock}>
          <Button className={styles.dialogBtn} onClick={onFinished}>
            К результатам
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export default Game
