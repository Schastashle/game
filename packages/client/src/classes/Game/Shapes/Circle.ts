import ShapeBase from './ShapeBase'
import { Shapes } from './types'

export default class Circle extends ShapeBase {
  public readonly radius: number
  public readonly type = 'circle'
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
    nested: Shapes[],
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
    // Вычисляет центр фигуры чтобы не делать это снаружи
    const centerX = this.x + this.width / 2
    const centerY = this.y + this.height / 2

    ctx.beginPath()
    ctx.arc(centerX, centerY, this.radius * this.scale, 0, 2 * Math.PI)
    ctx.fillStyle = this.fill_style
    ctx.fill()
    ctx.strokeStyle = this.stroke_style
    ctx.lineWidth = this.line_width
    ctx.closePath()
  }
}
