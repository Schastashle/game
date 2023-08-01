import { Indexed, Rect, StrokeStyle } from './types'

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
    lineTo,
  }: {
    moveTo: Indexed<number>
    lineTo: Indexed<number>
  }): void {
    this.ctx.beginPath()
    this.ctx.moveTo(moveTo.x, moveTo.y)
    this.ctx.lineTo(lineTo.x, lineTo.y)
    this.ctx.closePath()
    this.ctx.stroke()
  }

  protected strokeRect(rect: Rect, style: StrokeStyle) {
    const ctx = this.ctx
    ctx.save()

    ctx.strokeStyle = style.color
    ctx.lineWidth = style.width
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)

    ctx.restore()
  }

  protected fillRect(rect: Rect, fillStyle: string) {
    const ctx = this.ctx
    ctx.save()

    ctx.fillStyle = fillStyle
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)

    ctx.restore()
  }

  protected clearRect(rect: Rect) {
    this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height)
  }
}
