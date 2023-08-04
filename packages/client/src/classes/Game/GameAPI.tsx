import CanvasAPI from './CanvasAPI'
import { Circle, Square, Shapes } from './Shapes'
import Stack from '../Stack'

import { GridParams, CellParams, Indexed } from './types'
import { Animation, easings } from '../Animation'

type ShapeAnimationProps = Pick<Shapes, 'x' | 'y' | 'scale'>

export default class GameAPI extends CanvasAPI {
  private readonly gridParams: GridParams
  private readonly cellParams: CellParams
  private readonly gems: Shapes[]
  private matrix: Shapes[][]
  private readonly gridCoords: Indexed<number[]>
  public counts = 0
  private stackGems: Stack<Shapes>
  private disabled: boolean

  constructor(
    width: number,
    height: number,
    columns: number,
    rows: number,
    cellParams: CellParams,
    gems: Shapes[]
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
    this.disabled = false
  }

  private getRandomGem(): Shapes {
    const random_number = Math.floor(Math.random() * this.gems.length)
    const gem: Shapes = this.gems[random_number]
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
    const nestedGems: Shapes[] | [] = nested.map(item => {
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
          item.radius
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
        gem.radius
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
        nestedGems
      )
    }
  }

  private getCoords(column: number, row: number, gem: Shapes): Indexed<number> {
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
        const gem: Shapes = this.getRandomGem()
        const { x, y } = this.getCoords(column, row, gem)

        gem.setCoords(x, y)
        gem.setPositionData(column, row)

        this.matrix[row].push(gem)

        if (gem.nested.length) {
          gem.nested = gem.nested.map((shape: Shapes) => {
            const { x, y } = this.getCoords(column, row, shape)
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
        gem.drawShape(this.ctx)

        // Отрисовываем вложенные элементы фигур
        const nested = gem.nested

        if (nested.length) {
          nested.forEach(gem => gem.drawShape(this.ctx))
        }
      })
    })
  }

  private drawGem(column: number, row: number, gem: Shapes): void {
    gem.setPositionData(column, row)

    const { x, y } = this.getCoords(column, row, gem)

    gem.setCoords(x, y)
    gem.drawShape(this.ctx)

    gem.nested.forEach(item => {
      item.setPositionData(column, row)

      const { x, y } = this.getCoords(column, row, item)

      item.setCoords(x, y)
      item.drawShape(this.ctx)
    })
  }

  // Отрисовывает фигуры вне сетки
  private drawDetachedGem(gem: Shapes): void {
    gem.drawShape(this.ctx)

    const { x, y, scale } = gem
    const parentWidth = gem.width
    const parentHeight = gem.height

    gem.nested.forEach(nestedGem => {
      nestedGem.scale = scale
      // вычисляет разницу с шириной родителя чтобы сместить от края
      const normalizedX = x + (parentWidth - nestedGem.width) / 2
      const normalizedY = y + (parentHeight - nestedGem.height) / 2

      nestedGem.setCoords(normalizedX, normalizedY)
      nestedGem.drawShape(this.ctx)
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

  private swapGems(gem1: Shapes, gem2: Shapes): void {
    // Свап элементов на canvas

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

  private checkThreeInRow(): Shapes[] {
    const { columns, rows } = this.gridParams

    // Проверка по горизонтали
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns - 2; column++) {
        const element: Shapes = this.matrix[row][column]

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

  private async replaceCombination(array: Shapes[] | []): Promise<void> {
    return new Promise<void>(res =>
      array.forEach((gem: Shapes) => {
        const { column, row, width, height } = gem

        this.animateDestroy(gem)
          .then(() => {
            this.clearCanvasByCoords(column, row, width, height)
          })
          .then(() => {
            const generatedGem: Shapes = this.getRandomGem()

            generatedGem.setPositionData(column, row)
            generatedGem.setCoords(gem.x, gem.y)
            this.matrix[row][column] = generatedGem
            this.drawGem(column, row, generatedGem)
          })
          .then(() => {
            this.disabled = false
            res()
          })
      })
    ).then(() => {
      const threeInRow = this.checkThreeInRow()

      if (threeInRow.length) {
        this.replaceCombination(threeInRow)
      }
    })
  }

  public setSelectedGem(
    x: number,
    y: number,
    callback?: (n: number) => void
  ): void {
    if (this.disabled) return
    const { column, row } = this.getGemPositionByCoords(x, y)
    const targetGem = this.matrix[row][column]
    const stack = this.stackGems.getStack()

    if (stack.length === 0) {
      this.stackGems.push(targetGem)
    } else {
      const movableGem = stack[0]

      if (
        (Math.abs(movableGem.row - targetGem.row) <= 1 &&
          Math.abs(movableGem.column - targetGem.column) === 0) ||
        (movableGem.row === targetGem.row &&
          Math.abs(movableGem.column - targetGem.column) <= 1)
      ) {
        this.stackGems.push(targetGem)
      }
    }

    if (this.stackGems.getStack().length === this.stackGems.getLength()) {
      // @ts-ignore
      this.swapGems()
      // прибавляем 3 очка
      this.counts = this.counts + 3

      if (callback) {
        callback(this.counts)
      }

      const [gem1, gem2] = this.stackGems.getStack()
      this.animateSwap(gem1, gem2)
        .then(() => this.swapGems(gem1, gem2))
        .then(() => {
          this.drawGameGrid()
          const threeInRow: Shapes[] = this.checkThreeInRow()
          if (!threeInRow.length) {
            this.animateSwap(gem1, gem2)
              .then(() => {
                this.swapGems(gem1, gem2)
              })
              .then(() => {
                this.stackGems.clear()
                this.drawGameGrid()
                return
              })
          }
          return threeInRow
        })
        .then(threeInRow => {
          this.replaceCombination(threeInRow)
        })
    }
  }

  private async animateSwap(gem1: Shapes, gem2: Shapes): Promise<void> {
    // Блокирует взаимодействие с гемами на время анимации
    this.disabled = true

    const duration = 300
    const easing = easings.easeOutCubic

    const gem1Coords = { x: gem1.x, y: gem1.y }
    const gem2Coords = { x: gem2.x, y: gem2.y }

    const animateGem1 = new Animation(gem1 as ShapeAnimationProps)
    const animateGem2 = new Animation(gem2 as ShapeAnimationProps)

    const clearSlots = () => {
      this.clearCanvasByCoords(gem1.column, gem1.row, gem1.width, gem1.height)
      this.clearCanvasByCoords(gem2.column, gem2.row, gem2.width, gem2.height)
    }
    const tick1 = (gem: Shapes) => {
      clearSlots()
      this.drawDetachedGem(gem)
    }
    const tick2 = (gem: Shapes) => {
      this.drawDetachedGem(gem)
    }

    await new Promise<void>(resolve => {
      animateGem1.to(gem2Coords, duration, {
        easing,
        tick: () => tick1(gem1),
      })
      animateGem2.to(gem1Coords, duration, {
        easing,
        tick: () => tick2(gem2),
        onComplete: () => {
          this.disabled = false
          resolve()
        },
      })
    })
  }

  private async animateDestroy(gem: Shapes): Promise<void> {
    // Блокирует взаимодействие с гемами на время анимации
    this.disabled = true

    const duration = 300
    const easing = easings.easeOutCubic

    const { column, row, width, height } = gem

    const animateGem = new Animation(gem as ShapeAnimationProps)

    await new Promise<void>(resolve => {
      animateGem.to({ scale: 0 }, duration, {
        easing,
        tick: () => {
          this.clearCanvasByCoords(column, row, width, height)
          this.drawDetachedGem(gem)
        },
        onComplete: () => {
          this.stackGems.clear()
          resolve()
        },
      })
    })
  }

  // завершение игры
  public finished(callback?: () => void): void {
    if (callback) {
      callback()
    }
  }

  // старт игры
  public start(callback?: () => void) {
    if (callback) {
      callback()
    }
  }
}
