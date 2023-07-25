import React, { FC, useCallback, useEffect, useState } from 'react'

import GameAPI from '../../classes/Game/GameAPI'
import { gridParams, cellParams, gems } from './constants'

import styles from './game.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { gameSliceActions } from '../../store/slices/gameSlice/index'
import Timer from '../../components/UI/Timer/Timer'
import Counter from '../../components/UI/Counter'
import Dialog from '../../components/UI/Dialog/Dialog'
import Button from '../../components/UI/Button'
import { useDialog } from '../../components/UI/Dialog/bll'
import { useNavigate } from 'react-router-dom'
import { Shapes } from '../../classes/Game/Shapes'


const gameAPI: GameAPI = new GameAPI(
  gridParams.width,
  gridParams.height,
  gridParams.columns,
  gridParams.rows,
  cellParams,
  gems as Shapes[]
)

gameAPI.drawGameGrid()
gameAPI.distributeGems()

const Game: FC = () => {
  const canvasRef: React.RefObject<HTMLDivElement> = React.createRef()
  const wrapperRef: React.RefObject<HTMLDivElement> = React.createRef()
  const canvas: HTMLCanvasElement = gameAPI.getCanvas()
  const dispatch = useDispatch()
  const timer = useSelector<any>(state => state.game.timer) as number
  const counts = useSelector<any>(state => state.game.counts) as number
  const { isActive, onOpen, onClose } = useDialog()
  const navigate = useNavigate()
  const [isFullscreenMode, setIsFullScreen] = useState(false)

  useEffect(() => {
    ;(canvasRef.current as HTMLDivElement).appendChild(canvas)
  }, [])

  const setCount = useCallback((n: number) => {
    dispatch(gameSliceActions.setCounts(n))
  }, [])

  const onSelectGem = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = canvas.getBoundingClientRect()
    const x = event.clientX - left
    const y = event.clientY - top

    gameAPI.setSelectedGem(x, y, setCount)
  }

  const toggleFullscreen = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()

      if (isFullscreenMode) {
        document.exitFullscreen()
      } else {
        ;(wrapperRef.current as HTMLDivElement).requestFullscreen()
      }

      setIsFullScreen(!isFullscreenMode)
    },
    [canvasRef, isFullscreenMode]
  )

  const onFinished = useCallback(() => {
    navigate('/game/finish')
  }, [])

  useEffect(() => {
    if (timer === 0) {
      onOpen()
    }
  }, [timer])

  return (
    <div ref={wrapperRef}>
      <div className={styles.header}>
        <div>
          <Timer initialSeconds={30} />
        </div>

        <div>
          <Counter target={60} />
        </div>
      </div>

      <div className={styles.game} ref={canvasRef} onClick={onSelectGem}>
        <div className={styles['game-controls']}>
          <button
            className={styles['button-fullscreen']}
            onClick={toggleFullscreen}>
            Переключить режим просмотра
          </button>
        </div>
      </div>

      <Dialog
        open={isActive}
        onClose={() => {
          onClose()

          onFinished()
        }}>
        <h2 className={styles.dialogTitle}>
          {counts >= 60 ? <>Победа</> : <>Поражение</>}
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
