import { Indexed } from './types'

export default class CanvasAPI {
  protected readonly width: number
  protected readonly height: number
  protected readonly canvas: HTMLCanvasElement
  protected readonly ctx: CanvasRenderingContext2D

  constructor(width = 100, height = 100) {
    this.width = width
    this.height = height
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.setCanvasProperty()
  }

  private setCanvasProperty(): void {
    this.canvas.setAttribute('width', this.width.toString())
    this.canvas.setAttribute('height', this.height.toString())
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  protected drawLine({
    moveTo,
  }: //lineTo,
  {
    moveTo: Indexed<number>
    //lineTo: Indexed<number>
  }): void {
    this.ctx.beginPath()
    this.ctx.moveTo(moveTo.x, moveTo.y)
    //this.ctx.lineTo(lineTo.x, lineTo.y)
    this.ctx.closePath()
    this.ctx.stroke()
  }
}
