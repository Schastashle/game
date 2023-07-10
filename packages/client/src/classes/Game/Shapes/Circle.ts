import ShapeBase from './ShapeBase'
import { Circle as CircleType, Square as SquareType } from './types'

export default class Circle extends ShapeBase {
  public readonly radius: number

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
    nested: (SquareType | CircleType)[],
    radius: number
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
    this.radius = radius
  }

  public drawShape(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = this.fill_style
    ctx.fill()
    ctx.strokeStyle = this.stroke_style
    ctx.lineWidth = this.line_width
    ctx.closePath()
  }
}
