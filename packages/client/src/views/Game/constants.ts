import { CellParams } from '../../classes/Game/types'
import Square from '../../classes/Game/Shapes/Square'
import Circle from '../../classes/Game/Shapes/Circle'
import ShapeBase from '../../classes/Game/Shapes/ShapeBase'

const canvasParams = {
  width: 700,
  height: 500,
}

const gap = canvasParams.width / 40

const gridParams = {
  columns: 7,
  rows: 5,
}

const cellWidth = canvasParams.width / gridParams.columns - gap
const cellHeight = canvasParams.height / gridParams.rows - gap

const cellParams: CellParams = {
  width: cellWidth,
  height: cellHeight,
  gap,
}

const defaultFigure = {
  radius: cellWidth / 2,
  x: 0,
  y: 0,
  width: cellWidth,
  height: cellHeight,
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
        radius: cellWidth / 4,
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
        width: cellWidth / 2,
        height: cellHeight / 2,
        nested: [],
      }),
    ],
  }),
]

export { cellParams, gems, gridParams }
