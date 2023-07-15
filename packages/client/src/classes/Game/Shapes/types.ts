type Shape = {
  id: number
  type: string
  width: number
  height: number
  x: number
  y: number
  fill_style: string
  stroke_style: string
  line_width: number
  nested?: (Circle | Square)[]
}

type Circle = {
  radius: number
} & Shape

type Square = Shape

export type { Circle, Square, Shape }
