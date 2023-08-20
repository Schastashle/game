import React, {
  FC,
  useCallback,
  useEffect,
  useState,
  useRef,
  memo,
  forwardRef,
} from 'react'

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
import { GameResult, GameState } from '../../types/GameState'
import SVGSpinner from '../../components/SVGSpinner/SVGSpinner'

const INTERVAL_MS = 1 * 20 * 1000 // 5 * 1000 //
const MIN_GEM = 70

function createGame() {
  const gameAPI = new GameAPI(
    gridParams.columns,
    gridParams.rows,
    cellParams,
    gems
  )
  gameAPI.initialize()
  return gameAPI
}

const Game: FC = () => {
  const dispatch = useAppDispatch()
  const { gameState, startTime, gameResult } = useAppSelector(
    state => state.game
  )
  const user = useAppSelector(state => state.user.user)

  const [counts, setCounts] = useState(0)
  const { isActive, onOpen, onClose } = useDialog()
  const [isFullscreenMode, setIsFullScreen] = useState(false)
  const refGame = useRef<{ gameAPI: GameAPI; timerId?: number }>({
    gameAPI: createGame(),
  })
  const refCounts = useRef<number>(0)
  // dom ref
  const canvasWrapperRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // после каждого рендеринга
  // добавляем канву от игры к компоненту
  useEffect(() => {
    const parent = canvasWrapperRef.current
    const canvas = refGame.current?.gameAPI.getCanvas()
    if (parent && canvas && canvas.parentElement !== parent)
      parent?.appendChild(canvas)
  })

  useEffect(() => {
    if (gameState === GameState.ini) {
      const startTime = new Date()
      const timerId = setTimeout(endTimer, INTERVAL_MS) as unknown as number
      refGame.current.timerId = timerId
      dispatch(gameSliceActions.play({ startTime: startTime.getTime() }))
    } else if (gameState === GameState.stop) {
      // ждем окончания игры, показываем окно
      clearTimeout(refGame.current?.timerId)
      refGame.current?.gameAPI.finished()
      onOpen()
    }
  }, [gameState])

  // сохраняем результат, если победили
  useEffect(() => {
    if (user?.login && gameResult?.winner) {
      dispatch(
        addUserToLeaderboard({
          userId: user.id,
          scoresFir: gameResult.counts,
          userName: user.login,
        })
      )
    }
  }, [gameResult])

  // реагируем на окончание таймера
  const endTimer = useCallback(() => {
    const winner = refCounts.current >= MIN_GEM

    dispatch(
      gameSliceActions.stop({
        gameResult: { winner, counts: refCounts.current },
      })
    )
  }, [])

  const incCount = useCallback((n: number) => {
    refCounts.current = refCounts.current + n
    setCounts(refCounts.current)
  }, [])

  const onSelectGem = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const gameAPI = refGame.current?.gameAPI
    if (!gameAPI) return

    const canvas = gameAPI.getCanvas()
    const { left, top } = canvas.getBoundingClientRect()
    const x = event.clientX - left
    const y = event.clientY - top

    gameAPI.trySelectedGem(x, y, incCount)
  }, [])

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
    [isFullscreenMode]
  )

  const getMSec = useCallback(
    (date: Date) => {
      return startTime! + INTERVAL_MS - date.getTime()
    },
    [startTime]
  )

  return (
    <>
      <div ref={wrapperRef}>
        <div className={styles.header}>
          <div className={styles.timer}>
            {startTime && (
              <Timer getMSec={getMSec} played={gameState === GameState.play} />
            )}
          </div>

          <div>
            <Counter target={MIN_GEM} counts={counts} />
          </div>

          <div className={styles['game-controls']}>
            <button
              className={styles['button-fullscreen']}
              onClick={toggleFullscreen}>
              Переключить режим просмотра
            </button>
          </div>
        </div>

        <div
          className={styles.game}
          ref={canvasWrapperRef}
          onClick={onSelectGem}
        />
      </div>
      {gameState === GameState.stop && (
        <GameDialog
          isActive={isActive}
          onClose={onClose}
          gameResult={gameResult}
        />
      )}
    </>
  )
}

type DialogProps = {
  gameResult?: GameResult
  isActive: boolean
  onClose: () => void
}

const GameDialog: FC<DialogProps> = memo(
  ({ gameResult, isActive, onClose }) => {
    const navigate = useNavigate()

    const onCloseDialog = useCallback(() => {
      onClose() // непонятно
      navigate('/game/finish')
    }, [])

    const gotoFinish = useCallback(() => {
      navigate('/game/finish')
    }, [])

    return (
      <Dialog open={isActive} onClose={onCloseDialog}>
        <h2 className={styles.dialogTitle}>
          {gameResult?.winner ? <>Победа</> : <>Поражение</>}
        </h2>

        <p className={styles.dialogCounts}>Cчет: {gameResult?.counts}</p>

        <div className={styles.dialogBtnBlock}>
          <Button className={styles.dialogBtn} onClick={gotoFinish}>
            К результатам
          </Button>
        </div>
      </Dialog>
    )
  }
)

// {gameState === GameState.stop && (
// )}
export default Game
