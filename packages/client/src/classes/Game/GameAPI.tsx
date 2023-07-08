import CanvasAPI from './CanvasAPI'
import Circle from './Shapes/Circle'
import Square from './Shapes/Square'
import Stack from '../Stack'

import { GridParams, CellParams, Indexed } from './types'
import { Circle as CircleType, Square as SquareType } from './Shapes/types'

export default class GameAPI extends CanvasAPI {
  private readonly gridParams: GridParams
  private readonly cellParams: CellParams
  private readonly gems: (CircleType | SquareType)[]
  private matrix: [][] | (Circle | Square)[][]
  private readonly gridCoords: Indexed<number[]>
  private stackGems: Stack

  constructor(
    width: number,
    height: number,
    columns: number,
    rows: number,
    cellParams: CellParams,
    gems: (CircleType | SquareType)[]
  ) {
    super(width, height)

    this.gridParams = {
      width: width,
      height: height,
      rows: rows,
      columns: columns,
    }
    this.cellParams = cellParams
    this.gems = gems
    this.matrix = []
    this.gridCoords = {
      columns: [0],
      rows: [0],
    }
    this.stackGems = new Stack(2)
  }

  private getRandomGem(): Square | Circle {
    const random_number = Math.floor(Math.random() * this.gems.length)
    const gem: SquareType | CircleType = this.gems[random_number]
    const {
      id,
      type,
      width,
      height,
      x,
      y,
      fill_style,
      stroke_style,
      line_width,
      nested = [],
    } = gem
    const nestedGems: (Square | Circle)[] | [] = nested.map(item => {
      const {
        id,
        type,
        width,
        height,
        x,
        y,
        fill_style,
        stroke_style,
        line_width,
      } = item

      if (item.type === 'circle') {
        return new Circle(
          width,
          height,
          x,
          y,
          id,
          type,
          fill_style,
          stroke_style,
          line_width,
          [],
          (item as unknown as Circle).radius
        )
      } else {
        return new Square(
          width,
          height,
          x,
          y,
          id,
          type,
          fill_style,
          stroke_style,
          line_width,
          []
        )
      }
    })

    if (type === 'circle') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new Circle(
        width,
        height,
        x,
        y,
        id,
        type,
        fill_style,
        stroke_style,
        line_width,
        nestedGems,
        (gem as unknown as Circle).radius
      )
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new Square(
        width,
        height,
        x,
        y,
        id,
        type,
        fill_style,
        stroke_style,
        line_width,
        nestedGems
      )
    }
  }

  private getCircleCoords(
    column: number,
    row: number,
    gem: Circle
  ): Indexed<number> {
    const { gap, width: cellWidth, height: cellHeight } = this.cellParams
    const { width: gemWidth, height: gemHeight } = gem
    const targetColumn: number = column + 1
    const targetRow: number = row + 1

    const x: number =
      column * cellWidth + gap * targetColumn + gemWidth / 2 - gap / 2
    const y: number =
      row * cellHeight + gap * targetRow + gemHeight / 2 - gap / 2

    return { x, y }
  }

  private getSquareCoords(
    column: number,
    row: number,
    gem: Square
  ): Indexed<number> {
    const { width: gemWidth, height: gemHeight } = gem
    const { gap, width: cellWidth, height: cellHeight } = this.cellParams

    const x: number =
      cellWidth * column + (cellWidth - gemWidth) / 2 + gap * column + gap / 2
    const y: number =
      cellHeight * row + (cellHeight - gemHeight) / 2 + gap * row + gap / 2

    return { x, y }
  }

  private fillMatrix(): void {
    const { columns, rows } = this.gridParams

    if (this.matrix.length) this.matrix = []

    for (let row = 0; row < rows; row++) {
      this.matrix.push([])

      for (let column = 0; column < columns; column++) {
        const gem: Circle | Square = this.getRandomGem()
        const { x, y } =
          gem.type === 'circle'
            ? this.getCircleCoords(column, row, gem as unknown as Circle)
            : this.getSquareCoords(column, row, gem as unknown as Square)

        gem.setCoords(x, y)
        gem.setPositionData(column, row)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.matrix[row].push(gem)

        if (gem.nested.length) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          gem.nested = gem.nested.map((shape: Circle | Square) => {
            const { x, y } =
              gem.type === 'circle'
                ? this.getCircleCoords(column, row, shape as unknown as Circle)
                : this.getSquareCoords(column, row, shape as unknown as Square)

            shape.setCoords(x, y)

            return shape
          })
        }
      }
    }
  }

  private checkCombinations(): boolean {
    const { rows, columns } = this.gridParams

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns - 2; column++) {
        const element = this.matrix[row][column]

        if (
          element.id === this.matrix[row][column + 1].id &&
          element.id === this.matrix[row][column + 2].id
        ) {
          return true
        }
      }
    }

    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows - 2; row++) {
        const element = this.matrix[row][column]

        if (
          element.id === this.matrix[row + 1][column].id &&
          element.id === this.matrix[row + 2][column].id
        ) {
          return true
        }
      }
    }

    return false
  }

  private drawAllGems(): void {
    this.matrix.forEach(row => {
      row.forEach(gem => {
        ;(gem as unknown as Square | Circle).drawShape(this.ctx)

        // Отрисовываем вложенные элементы фигур
        const nested = (gem as unknown as Circle | Square).nested

        if (nested.length) {
          nested.forEach(gem =>
            (gem as unknown as Circle | Square).drawShape(this.ctx)
          )
        }
      })
    })
  }

  private drawGem(column: number, row: number, gem: Circle | Square): void {
    gem.setPositionData(column, row)

    const { x, y } =
      gem.type === 'circle'
        ? this.getCircleCoords(column, row, gem as unknown as Circle)
        : this.getSquareCoords(column, row, gem)

    gem.setCoords(x, y)
    gem.drawShape(this.ctx)

    gem.nested.forEach(item => {
      ;(item as unknown as Circle | Square).setPositionData(column, row)

      const { x, y } =
        item.type === 'circle'
          ? this.getCircleCoords(column, row, item as unknown as Circle)
          : this.getSquareCoords(column, row, item as unknown as Square)

      ;(item as unknown as Circle | Square).setCoords(x, y)
      ;(item as unknown as Circle | Square).drawShape(this.ctx)
    })
  }

  private clearCanvasByCoords(
    column: number,
    row: number,
    width: number,
    height: number
  ): void {
    const { columns, rows } = this.gridCoords
    const { gap } = this.cellParams

    this.ctx.clearRect(
      columns[column],
      rows[row],
      width + gap - 2,
      height + gap - 2
    )
  }

  private swapGems(): void {
    // Свап элементов на canvas
    const [gem1, gem2] = this.stackGems.getStack()

    this.clearCanvasByCoords(gem1.column, gem1.row, gem1.width, gem1.height)
    this.clearCanvasByCoords(gem2.column, gem2.row, gem2.width, gem2.height)

    const tempGem = JSON.parse(JSON.stringify(gem1))

    // Свап элементов в matrix
    this.matrix[gem1.row][gem1.column] = gem2
    this.matrix[gem2.row][gem2.column] = gem1

    this.drawGem(gem2.column, gem2.row, gem1)
    this.drawGem(tempGem.column, tempGem.row, gem2)
  }

  public distributeGems(): void {
    this.fillMatrix()

    if (this.checkCombinations()) {
      this.distributeGems()
    } else {
      this.drawAllGems()
    }
  }

  public drawGameGrid(): void {
    const { columns, rows } = this.gridParams
    const { gap, width: cellWidth, height: cellHeight } = this.cellParams

    // Отрисовка вертикальных линий сетки
    for (let column = 1; column < columns; column++) {
      const startX = column * cellWidth + gap * column
      const moveTo: Indexed<number> = {
        x: startX,
        y: 0,
      }
      const lineTo: Indexed<number> = {
        x: column * cellWidth + gap * column,
        y: this.height,
      }

      this.gridCoords.columns[column] = startX
      this.drawLine({ moveTo, lineTo })
    }

    // Отрисовка горизонтальных линий сетки
    for (let row = 1; row < rows; row++) {
      const startY = cellHeight * row + gap * row
      const moveTo = {
        x: 0,
        y: startY,
      }
      const lineTo = {
        x: this.width,
        y: cellHeight * row + gap * row,
      }

      this.gridCoords.rows[row] = startY
      this.drawLine({ moveTo, lineTo })
    }
  }

  private getGemPositionByCoords(x: number, y: number): Indexed<number> {
    const { columns, rows } = this.gridCoords

    return {
      column: columns.findIndex((item, index, array) => {
        if (index === columns.length - 1) {
          return x >= item
        }

        return array[index] <= x && x <= array[index + 1]
      }),
      row: rows.findIndex((item, index, array) => {
        if (index === rows.length - 1) {
          return y >= item
        }

        return array[index] <= y && y <= array[index + 1]
      }),
    }
  }

  private checkThreeInRow(): (Circle | Square)[] | [] {
    const { columns, rows } = this.gridParams

    // Проверка по горизонтали
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns - 2; column++) {
        const element: Square | Circle = this.matrix[row][column]

        if (
          element.id === this.matrix[row][column + 1].id &&
          element.id === this.matrix[row][column + 2].id
        ) {
          return [
            element,
            this.matrix[row][column + 1],
            this.matrix[row][column + 2],
          ]
        }
      }
    }

    // Проверка по вертикали
    for (let row = 0; row < rows - 2; row++) {
      for (let column = 0; column < columns; column++) {
        const element = this.matrix[row][column]
        if (
          element.id === this.matrix[row + 1][column].id &&
          element.id === this.matrix[row + 2][column].id
        ) {
          return [
            element,
            this.matrix[row + 1][column],
            this.matrix[row + 2][column],
          ]
        }
      }
    }

    return []
  }

  private replaceCombination(array: (Circle | Square)[] | []): void {
    array.forEach((gem: Circle | Square) => {
      const { column, row, width, height } = gem

      this.clearCanvasByCoords(column, row, width, height)

      const generatedGem: Square | Circle = this.getRandomGem()

      generatedGem.setPositionData(column, row)
      this.matrix[row][column] = generatedGem
      this.drawGem(column, row, generatedGem)
    })

    const threeInRow = this.checkThreeInRow()

    if (threeInRow.length) {
      this.replaceCombination(threeInRow)
    }
  }

  public setSelectedGem(x: number, y: number): void {
    const { column, row } = this.getGemPositionByCoords(x, y)
    const targetGem = this.matrix[row][column]
    const stack = this.stackGems.getStack()

    if (stack.length === 0) {
      this.stackGems.push(targetGem)
    } else {
      const movableGem = stack[0]

      if (
        (Math.abs(
          movableGem.row - (targetGem as unknown as Circle | Square).row
        ) <= 1 &&
          Math.abs(
            movableGem.column - (targetGem as unknown as Circle | Square).column
          ) === 0) ||
        (movableGem.row === (targetGem as unknown as Circle | Square).row &&
          Math.abs(
            movableGem.column - (targetGem as unknown as Circle | Square).column
          ) <= 1)
      ) {
        this.stackGems.push(targetGem)
      }
    }

    if (this.stackGems.getStack().length === this.stackGems.getLength()) {
      this.swapGems()

      const threeInRow: (Circle | Square)[] | [] = this.checkThreeInRow()

      if (!threeInRow.length) {
        this.swapGems()
        this.stackGems.clear()

        return
      }

      this.replaceCombination(threeInRow)
      this.stackGems.clear()
    }
  }
}
