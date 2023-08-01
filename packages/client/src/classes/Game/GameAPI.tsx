import CanvasAPI from './CanvasAPI'

import { GridParams, CellParams, Indexed, Rect } from './types'
import { Animation, EasingFunction, easings } from '../Animation'
import ShapeBase from './Shapes/ShapeBase'

enum axisType {
  column = 1,
  row = 2,
}

type Position = {
  column: number
  row: number
}

const DEFAULT_DURATION = 1000

type ShapeAnimationProps = Pick<ShapeBase, 'x' | 'y' | 'scale'>

export default class GameAPI extends CanvasAPI {
  private readonly gridParams: GridParams
  private matrix: ShapeBase[][]
  private selectedPos?: Position = undefined
  private disabled: boolean

  constructor(
    columns: number,
    rows: number,
    private readonly cellParams: CellParams,
    private readonly templatedGems: ShapeBase[]
  ) {
    const width = columns * (cellParams.width + cellParams.gap)
    const height = rows * (cellParams.height + cellParams.gap)

    super(width, height)

    this.gridParams = {
      width,
      height,
      rows,
      columns,
    }
    this.cellParams = cellParams
    this.templatedGems = templatedGems
    this.matrix = []
    this.disabled = false
  }

  public initialize() {
    if (0 !== this.matrix.length) return

    this.fillGems()
    this.redrawAll()
  }

  // рисует сетку
  private drawGameGrid(): void {
    const { columns, rows, width, height } = this.gridParams

    this.drawGridLines(axisType.column, rows, width)
    this.drawGridLines(axisType.row, columns, height)
  }

  // первоначальное заполнение сетки с камнями
  private fillGems(): void {
    this.forEachGems(axisType.row, ({ row, column }) => {
      this.matrix[row] = this.matrix[row] || []

      // получить "камень" для ячейки с проверкой, что нет трех одинаковых "камней" рядом по обоим осям
      // можем не исключать, но тогда игра поиграет в начале сама с собой
      const badSiblings = this.badSiblings(row, column)
      const gem = this.getRandomGem(badSiblings)

      this.linkGemToCell(gem, row, column)
      return false
    })
  }

  private redrawAll() {
    const { width, height } = this.gridParams
    this.clearRect({ x: 0, y: 0, width, height })

    this.drawGameGrid()
    const selectedGem = this.getSelectedGem()

    this.forEachGems(axisType.row, pos => {
      const gem = this.gemByPos(pos)
      if (selectedGem !== gem) this.drawGem(gem, { noClear: true })
      return false
    })

    if (selectedGem) this.drawGem(selectedGem, { noClear: true })
  }

  private getRandomGem(excludedIds?: Set<number>): ShapeBase {
    const random_number = Math.floor(Math.random() * this.templatedGems.length)
    const gem = this.templatedGems[random_number]

    if (excludedIds && excludedIds.has(gem.id)) {
      return this.getRandomGem(excludedIds)
    }
    return gem.clone()
  }

  // возвращает запрещенных соседей слева и сверху
  private badSiblings(row: number, column: number): Set<number> {
    const result: Set<number> = new Set()

    if (column >= 2) {
      const id1 = this.gemByPos({ row, column: column - 1 })?.id
      const id2 = this.gemByPos({ row, column: column - 2 })?.id

      if (undefined !== id1 && id1 === id2) result.add(id1)
    }

    if (row >= 2) {
      const id1 = this.gemByPos({ row: row - 1, column })?.id
      const id2 = this.gemByPos({ row: row - 2, column })?.id

      if (undefined !== id1 && id1 === id2) result.add(id1)
    }

    return result
  }

  private linkGemToCell(gem: ShapeBase, row: number, column: number) {
    const center = this.getCellCenterXY(row, column)
    gem.setCenter(center.x, center.y)
    gem.setPositionData(column, row)

    this.matrix[row][column] = gem
  }

  private drawGridLines(axis: axisType, count: number, size: number) {
    for (let index = 1; index < count; index++) {
      const offset = this.getCellOffset(axis, index)
      let moveTo, lineTo

      if (axis === axisType.column) {
        moveTo = { x: 0, y: offset }
        lineTo = { x: size, y: offset }
      } else {
        moveTo = { x: offset, y: 0 }
        lineTo = { x: offset, y: size }
      }
      this.drawLine({ moveTo, lineTo })
    }
  }

  // возвращает позицию (колонка, строка) по координате
  private getPosByCoords(x: number, y: number): Indexed<number> {
    const column = Math.trunc(x / this.getCellSize(axisType.column))
    const row = Math.trunc(y / this.getCellSize(axisType.row))
    return { column, row }
  }

  // проход по "камням" по разным плоскостям
  forEachGems(
    axis: axisType,
    callback: (pos: Position, newLine: boolean) => boolean
  ) {
    const { columns, rows } = this.gridParams
    const out = axis === axisType.column ? columns : rows
    const inner = axis === axisType.column ? rows : columns

    for (let iout = 0; iout < out; iout++) {
      for (let iinner = 0; iinner < inner; iinner++) {
        let pos
        if (axis === axisType.column) {
          pos = { column: iout, row: iinner }
        } else {
          pos = { column: iinner, row: iout }
        }

        if (callback(pos, iinner === 0)) return
      }
    }

    return false
  }

  // ищет комбинации с тремя и более "камнями"
  private findGemLine(): ShapeBase[] {
    const result = new Set([
      ...this.findGemLineByAxis(axisType.column),
      ...this.findGemLineByAxis(axisType.row),
    ])

    return [...result]
  }

  // ищет комбинации с тремя и более "камнями" по оси axis
  private findGemLineByAxis(axis: axisType): ShapeBase[] {
    let gems: ShapeBase[] = []
    let prev: ShapeBase

    this.forEachGems(axis, (pos, newLine) => {
      const gem = this.gemByPos(pos)

      if (gem) {
        if (newLine || prev.id !== gem.id) {
          if (gems.length >= 3) return true

          gems = []
          prev = gem
        }
        gems.push(gem)
      }
      return false
    })

    if (gems.length >= 3) return gems
    return []
  }

  // ищет и удаляет комбинации, добавляет новые "камни" в очищенные ячейки (рекурсивно)
  private async removeGemLines(): Promise<number> {
    const gems = this.findGemLine()
    if (gems.length === 0) return 0

    let countGem = gems.length
    this.setSelectedPos(undefined)
    await this.animateDestroy(gems)

    gems.map(async deletedGem => {
      const { column, row } = deletedGem

      const gem = this.getRandomGem() // тут проверка не нужна, если будут линии то игра сама с собой поиграет
      this.linkGemToCell(gem, row, column)
      this.drawGem(gem)
    })

    countGem += await this.removeGemLines()
    return countGem
  }

  public async trySelectedGem(
    x: number,
    y: number,
    callback?: (n: number) => void
  ) {
    if (this.disabled) return

    const { column, row } = this.getPosByCoords(x, y)
    const targetGem = this.gemByPos({ column, row })
    const selectedGem = this.getSelectedGem()

    if (!targetGem) return

    if (!selectedGem) {
      this.setSelectedPos(targetGem)
      return
    }
    if (targetGem === selectedGem) {
      this.setSelectedPos(undefined)
      return
    }

    // *** disabled
    this.disabled = true

    const sideBySide =
      1 ===
      Math.abs(targetGem.row - selectedGem.row) +
        Math.abs(targetGem.column - selectedGem.column)

    if (sideBySide) {
      await this.animateSwap(selectedGem, targetGem)

      const countGem = await this.removeGemLines() // если success===true, внутри скинется select

      if (countGem === 0) {
        // смена не удалась, возвращаем обратно камни
        await this.animateSwap(targetGem, selectedGem)
      } else {
        // прибавляем очки
        if (callback) callback(countGem)
      }
    } else {
      this.setSelectedPos(undefined)
    }

    // *** disabled
    this.disabled = false
  }

  private setSelectedPos(pos: Position | undefined) {
    if (this.selectedPos === pos) return

    this.selectedPos = pos
    this.redrawAll()
  }

  private getSelectedGem() {
    return this.gemByPos(this.selectedPos)
  }

  private gemByPos(pos?: Position): ShapeBase | undefined {
    return pos ? this.matrix[pos.row][pos.column] : undefined
  }

  private getCellSize(axis: axisType): number {
    const shapeSize =
      axis === axisType.column ? this.cellParams.width : this.cellParams.height
    return shapeSize + this.cellParams.gap
  }

  private getCellOffset(axis: axisType, index: number): number {
    return this.getCellSize(axis) * index
  }

  private getCellCenter(axis: axisType, index: number): number {
    const start = this.getCellOffset(axis, index)
    const size = this.getCellSize(axis)

    return start + size / 2
  }

  private getCellCenterXY(row: number, column: number): Indexed<number> {
    return {
      x: this.getCellCenter(axisType.column, column),
      y: this.getCellCenter(axisType.row, row),
    }
  }

  // *** draw block ***
  private drawGem(gem?: ShapeBase, opts?: { noClear?: boolean }) {
    if (!gem) return
    opts = opts || {}

    const isSelected = gem === this.getSelectedGem()
    const margin = this.cellParams.gap / 2 - (isSelected ? 0 : 4)
    const bufferRect = this.bufferRect(gem.getRect(), margin)
    if (!opts.noClear) this.clearRect(bufferRect)

    gem.drawShape(this.ctx)

    if (isSelected) {
      //rgba(255, 255, 255, 0.3)
      const selRect = this.bufferRect(bufferRect, -1)
      this.strokeRect(selRect, { color: 'yellow', width: 4 })
    }
  }

  private bufferRect(rect: Rect, value: number): Rect {
    return {
      x: rect.x - value,
      y: rect.y - value,
      width: rect.width + 2 * value,
      height: rect.height + 2 * value,
    }
  }

  private async animateSwap(gem1: ShapeBase, gem2: ShapeBase): Promise<void> {
    const easing = easings.easeOutCubic

    const gem1Coords = { x: gem1.x, y: gem1.y }
    const gem2Coords = { x: gem2.x, y: gem2.y }

    // ожидаем окончания анимации смены
    await Promise.all([
      this.animate(gem1, gem2Coords, easing, this.redrawAll.bind(this)),
      this.animate(gem2, gem1Coords, easing, this.redrawAll.bind(this)),
    ])

    // меняем местами
    const gem1Pos = { row: gem1.row, column: gem1.column }
    this.linkGemToCell(gem1, gem2.row, gem2.column)
    this.linkGemToCell(gem2, gem1Pos.row, gem1Pos.column)
  }

  private async animateDestroy(gems: ShapeBase[]): Promise<void> {
    const easing = easings.easeOutCubic
    const defs = gems.map(async gem => {
      return this.animate(gem, { scale: 0 }, easing, () => this.drawGem(gem))
    })

    await Promise.all(defs)
  }

  // оборачиваем анимацию в промис
  private async animate(
    gem: ShapeBase,
    to: Indexed<number>,
    easing: EasingFunction,
    callback: () => void
  ) {
    const duration = DEFAULT_DURATION
    const animateGem = new Animation(gem as ShapeAnimationProps)

    await new Promise<void>(resolve => {
      animateGem.to(to, duration, {
        easing,
        tick: callback,
        onComplete: resolve,
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
