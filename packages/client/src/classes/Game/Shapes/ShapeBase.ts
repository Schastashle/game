import { Circle, Square } from './types'

export default class ShapeBase {
  public readonly id: number
  public readonly type: string
  protected readonly fill_style: string
  protected readonly stroke_style: string
  protected readonly line_width: number
  public readonly width: number
  public readonly height: number
  public x: number
  public y: number
  public column: number
  public row: number
  public nested: (Circle | Square)[] | []

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
    nested: (Square | Circle)[]
  ) {
    this.id = id
    this.type = type
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.fill_style = fill_style
    this.stroke_style = stroke_style
    this.line_width = line_width
    this.nested = nested
    this.column = 0
    this.row = 0
  }

  public setCoords(x: number, y: number): void {
    this.x = x
    this.y = y
  }

  public setPositionData(column: number, row: number): void {
    this.column = column
    this.row = row
  }
}