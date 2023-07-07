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

export type { CellParams, GridParams, Indexed }
