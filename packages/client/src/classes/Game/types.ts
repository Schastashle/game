type Indexed<T = unknown> = {
  [key in string]: T
}

type GridParams = {
  columns: number
  rows: number
  width: number
  height: number
}

type CellParams = {
  width: number
  height: number
  gap: number
}

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

type StrokeStyle = {
  color: string
  width: number
}
export type { CellParams, GridParams, Indexed, Rect, StrokeStyle }
