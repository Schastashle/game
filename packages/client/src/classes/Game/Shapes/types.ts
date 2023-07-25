import Circle from './Circle'
import Square from './Square'

export type Shapes = Circle | Square

export interface IShapes {
  id: number
  type: string
  fill_style: string
  stroke_style: string
  line_width: number
  width: number
  height: number
  x: number
  y: number
  radius?: number
  nested?: IShapes[]
}
