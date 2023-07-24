import ShapeBase from './ShapeBase'
import { Shapes } from './types'

export default class Square extends ShapeBase {
  public readonly type = 'square'
  public scale = 1
  constructor(
    width: number,
    height: number,
    x: number,
    y: number,
    id: number,
    type: string,
    fill_style: string,
    stroke_style: string,
    line_width: number,
    nested: Shapes[]
  ) {
    super(
      width,
      height,
      x,
      y,
      id,
      type,
      fill_style,
      stroke_style,
      line_width,
      nested
    )
  }

  public drawShape(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.fill_style
    ctx.fillRect(
      // Смещение прямоугольника во время скейлинга, чтобы оставался в центре
      this.x + (this.width / 2 - (this.width / 2) * this.scale),
      this.y + (this.height / 2 - (this.height / 2) * this.scale),
      this.width * this.scale,
      this.height * this.scale
    )
  }
}
