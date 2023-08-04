import ShapeBase, { ShapeBaseOpts } from './ShapeBase'

export interface CircleOpts extends ShapeBaseOpts {
  radius: number
}

export default class Circle extends ShapeBase {
  public readonly radius: number

  constructor(opts: CircleOpts) {
    super(opts)
    this.radius = opts.radius
  }

  protected drawMainShape(
    ctx: CanvasRenderingContext2D,
    parent: ShapeBase
  ): void {
    const { x, y, scale } = parent || this

    ctx.beginPath()

    ctx.arc(x, y, this.radius * scale, 0, 2 * Math.PI)
    ctx.fillStyle = this.fill_style
    ctx.fill()
    ctx.strokeStyle = ''
    ctx.lineWidth = 0
    ctx.closePath()
  }

  public clone() {
    const opts = this.getClonedOpts()

    return new Circle({
      ...opts,
      radius: this.radius,
    })
  }
}
