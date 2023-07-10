import ShapeBase from './ShapeBase'
import { Circle as CircleType, Square as SquareType } from './types'

export default class Square extends ShapeBase {
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
    nested: (CircleType | SquareType)[]
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
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}
