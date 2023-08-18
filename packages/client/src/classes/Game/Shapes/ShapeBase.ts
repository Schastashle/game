export interface ShapeBaseOpts {
  width: number
  height: number
  x: number
  y: number
  id: number
  type: string
  fill_style: string
  nested: ShapeBase[]
}

export default abstract class ShapeBase {
  public readonly id: number
  public readonly type: string
  protected readonly fill_style: string
  public readonly width: number
  public readonly height: number
  public x: number
  public y: number
  public column: number
  public row: number
  public nested: ShapeBase[] | []
  public scale = 1

  constructor(opts: ShapeBaseOpts) {
    this.id = opts.id
    this.type = opts.type
    this.width = opts.width
    this.height = opts.height
    this.x = opts.x
    this.y = opts.y
    this.fill_style = opts.fill_style
    this.nested = opts.nested
    this.column = 0
    this.row = 0
  }

  public setCenter(x: number, y: number): void {
    this.x = x
    this.y = y
    //this.nested.forEach(gem => gem.setCenter(x, y))
  }

  public setPositionData(column: number, row: number): void {
    this.column = column
    this.row = row
  }

  protected getClonedOpts(): ShapeBaseOpts {
    const nested = this.nested.map(shape => shape.clone())
    return {
      ...(this as unknown as ShapeBaseOpts), // todo уточнить как
      nested,
    }
  }

  public abstract clone(): ShapeBase

  protected abstract drawMainShape(
    ctx: CanvasRenderingContext2D,
    parent?: ShapeBase
  ): void

  public drawShape(ctx: CanvasRenderingContext2D): void {
    // Отрисовываем вложенные элементы фигур
    this.drawMainShape(ctx)

    if (this.nested.length) {
      this.nested.forEach(this.nestedDraw.bind(this, ctx))
    }

    //  ctx.fillStyle = "black";
    //  ctx.fillText(`x${this.x} y${this.y} c${this.column} r${this.row}`, this.x-40, this.y)
  }

  private nestedDraw(ctx: CanvasRenderingContext2D, gem: ShapeBase) {
    gem.drawMainShape(ctx, this)
  }

  public getRect() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
    }
  }
}
