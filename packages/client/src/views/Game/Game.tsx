import React, { useEffect, useRef } from 'react'

import GameAPI from '../../classes/Game/GameAPI'
import { gridParams, cellParams, gems } from './constans'

import styles from './game.module.css'

function Game() {
  const gameApi = new GameAPI(
    gridParams.width,
    gridParams.height,
    gridParams.columns,
    gridParams.rows,
    cellParams,
    gems
  )
  const canvas = gameApi.getCanvas()
  const canvasRef: React.LegacyRef<HTMLDivElement> | undefined = useRef(null)

  gameApi.drawGameGrid()
  gameApi.distributeGems()

  useEffect(() => {
    ;(canvasRef.current as unknown as HTMLDivElement).appendChild(canvas)
  })

  const onSelectGem = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { left, top } = canvas.getBoundingClientRect()
    const x = event.clientX - left
    const y = event.clientY - top

    gameApi.setSelectedGem(x, y)
  }

  return (
    <div className={styles.game} ref={canvasRef} onClick={onSelectGem}></div>
  )
}

export default Game
