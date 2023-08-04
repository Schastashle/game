import ShapeBase, { ShapeBaseOpts } from './ShapeBase'

export default class Square extends ShapeBase {
  constructor(opts: ShapeBaseOpts) {
    super(opts)
  }

  public drawMainShape(ctx: CanvasRenderingContext2D, parent: ShapeBase): void {
    const { x, y, scale } = parent || this

    const height = Math.trunc(this.height * scale)
    const width = Math.trunc(this.width * scale)

    ctx.fillStyle = this.fill_style

    ctx.fillRect(x - width / 2, y - height / 2, width, height)
  }

  public clone() {
    const opts = this.getClonedOpts()
    return new Square({
      ...opts,
    })
  }
}
