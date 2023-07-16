import React, { Component } from 'react'

import GameAPI from '../../classes/Game/GameAPI'
import { gridParams, cellParams, gems } from './constans'

import styles from './game.module.css'

export default class Game extends Component {
  private readonly canvas: HTMLCanvasElement
  private readonly canvasRef: React.RefObject<HTMLDivElement>
  private gameAPI: GameAPI

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
  }

  componentDidMount(): void {
    ;(this.canvasRef.current as HTMLDivElement).appendChild(this.canvas)
  }

  onSelectGem = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = this.canvas.getBoundingClientRect()
    const x = event.clientX - left
    const y = event.clientY - top

    this.gameAPI.setSelectedGem(x, y)
  }

  render() {
    return (
      <div
        className={styles.game}
        ref={this.canvasRef}
        onClick={this.onSelectGem}></div>
    )
  }
}
