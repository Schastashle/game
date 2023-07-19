import React, { Component } from 'react'

import GameAPI from '../../classes/Game/GameAPI'
import { gridParams, cellParams, gems } from './constans'

import styles from './game.module.css'

export default class Game extends Component {
  private readonly canvas: HTMLCanvasElement
  private readonly canvasRef: React.RefObject<HTMLDivElement>
  private gameAPI: GameAPI
  private fullscreenButtonText: string
  private isFullscreenMode: boolean

  constructor(props: object) {
    super(props)

    this.gameAPI = new GameAPI(
      gridParams.width,
      gridParams.height,
      gridParams.columns,
      gridParams.rows,
      cellParams,
      gems
    )
    this.canvas = this.gameAPI.getCanvas()
    this.canvasRef = React.createRef()

    this.gameAPI.drawGameGrid()
    this.gameAPI.distributeGems()

    this.fullscreenButtonText = 'На весь экран'
    this.isFullscreenMode = false
  }

  componentDidMount(): void {
    ;(this.canvasRef.current as HTMLDivElement).prepend(this.canvas)
  }

  onSelectGem = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = this.canvas.getBoundingClientRect()
    const x = event.clientX - left
    const y = event.clientY - top

    this.gameAPI.setSelectedGem(x, y)
  }

  toggleFullscreen = () => {
    this.isFullscreenMode
      ? document.exitFullscreen()
      : (this.canvasRef.current as HTMLDivElement).requestFullscreen()
    this.isFullscreenMode = !this.isFullscreenMode
  }

  render() {
    return (
      <div
        className={styles.game}
        ref={this.canvasRef}
        onClick={this.onSelectGem}>
        <div className={styles['game-controls']}>
          <button
            className={styles['button-fullscreen']}
            onClick={this.toggleFullscreen}>
            Переключить режим просмотра
          </button>
        </div>
      </div>
    )
  }
}
