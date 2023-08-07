import { CellParams } from '../../classes/Game/types'
import Square from '../../classes/Game/Shapes/Square'
import Circle from '../../classes/Game/Shapes/Circle'
import ShapeBase from '../../classes/Game/Shapes/ShapeBase'

const size = 100
const gap = 30

const gridParams = {
  columns: 5,
  rows: 4,
}

const cellParams: CellParams = {
  width: size,
  height: size,
  gap,
}

const defaultFigure = {
  radius: 50,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
}

const gems: ShapeBase[] = [
  new Circle({
    id: 0,
    ...defaultFigure,
    type: 'circle',
    fill_style: '#700961',

    nested: [
      new Circle({
        id: -1,
        ...defaultFigure,
        type: 'circle',
        fill_style: '#FFF',
        radius: 30,
        nested: [],
      }),
    ],
  }),
  new Circle({
    id: 1,
    ...defaultFigure,
    type: 'circle',
    fill_style: '#E61C5D',
    nested: [],
  }),
  new Square({
    id: 2,
    ...defaultFigure,
    type: 'square',
    fill_style: '#7EC36E',
    nested: [],
  }),
  new Square({
    id: 3,
    ...defaultFigure,
    type: 'square',
    fill_style: '#FFAA64',
    nested: [
      new Square({
        id: -1,
        ...defaultFigure,
        type: 'square',
        fill_style: '#fff',
        width: 50,
        height: 50,
        nested: [],
      }),
    ],
  }),
]

export { cellParams, gems, gridParams }
