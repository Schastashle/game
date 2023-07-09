import { GridParams, CellParams } from '../../classes/Game/types'
import { Circle, Square } from '../../classes/Game/Shapes/types'

const gridParams: GridParams = {
  columns: 5,
  rows: 4,
  width: 625,
  height: 500,
}
const cellParams: CellParams = {
  width: 100,
  height: 100,
  gap: 25,
}
const gems: (Circle | Square)[] = [
  {
    id: 0,
    type: 'circle',
    fill_style: '#700961',
    stroke_style: '',
    line_width: 0,
    radius: 50,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    nested: [
      {
        id: -1,
        type: 'circle',
        fill_style: '#FFF',
        stroke_style: '',
        line_width: 0,
        radius: 30,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      },
    ],
  },
  {
    id: 1,
    type: 'circle',
    fill_style: '#E61C5D',
    stroke_style: '',
    line_width: 0,
    radius: 50,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  },
  {
    id: 2,
    type: 'square',
    fill_style: '#7EC36E',
    stroke_style: '',
    line_width: 0,
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  },
  {
    id: 3,
    type: 'square',
    fill_style: '#FFAA64',
    stroke_style: '',
    line_width: 0,
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    nested: [
      {
        id: -1,
        type: 'square',
        fill_style: '#fff',
        stroke_style: '',
        line_width: 0,
        width: 50,
        height: 50,
        x: 0,
        y: 0,
      },
    ],
  },
]

export { cellParams, gems, gridParams }
