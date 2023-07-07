import React, { Component } from 'react'

import GameAPI from '../../classes/Game/GameAPI'
import { GridParams, CellParams } from '../../classes/Game/types'
import { Square, Circle } from '../../classes/Game/Shapes/types'

import styles from './game.module.css'

export default class Game extends Component {
  private readonly canvas: HTMLCanvasElement
  private readonly canvasRef: React.RefObject<HTMLDivElement>
  private gameAPI: GameAPI

  constructor(props: object) {
    super(props)

    const gridParams: GridParams = {
      columns: 5,
      rows: 4,
      width: 625,
      height: 500,
    }
    const cellParams: CellParams = {
      width: 100,
      height: 100,
      gap: 25,
    }
    const gems: (Circle | Square)[] = [
      {
        id: 0,
        type: 'circle',
        fill_style: '#700961',
        stroke_style: '',
        line_width: 0,
        radius: 50,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        nested: [
          {
            id: -1,
            type: 'circle',
            fill_style: '#FFF',
            stroke_style: '',
            line_width: 0,
            radius: 30,
            width: 100,
            height: 100,
            x: 0,
            y: 0,
          },
        ],
      },
      {
        id: 1,
        type: 'circle',
        fill_style: '#E61C5D',
        stroke_style: '',
        line_width: 0,
        radius: 50,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
      {
        id: 2,
        type: 'square',
        fill_style: '#7EC36E',
        stroke_style: '',
        line_width: 0,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      },
      {
        id: 3,
        type: 'square',
        fill_style: '#FFAA64',
        stroke_style: '',
        line_width: 0,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        nested: [
          {
            id: -1,
            type: 'square',
            fill_style: '#fff',
            stroke_style: '',
            line_width: 0,
            width: 50,
            height: 50,
            x: 0,
            y: 0,
          },
        ],
      },
    ]

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
