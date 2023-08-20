import { Indexed } from '../Game/types'
import { easings, EasingFunction } from './easings'

type Obj = Indexed<number>

type Options = {
  tick: () => void
  easing?: EasingFunction
  onComplete?: () => void
}

export default class Animation {
  private target: HTMLElement | Obj
  private startTime: number | null
  private duration: number
  private easing: EasingFunction
  private tick: (() => void) | null
  private onComplete: (() => void) | null
  private startValues: Obj
  private changeValues: Obj
  private units: Record<string, string>
  private lastAnimateKey = 0

  constructor(target: HTMLElement | Obj) {
    this.target = target
    this.startTime = null
    this.duration = 0
    this.easing = easings.linear
    this.onComplete = null
    this.tick = null
    this.startValues = {}
    this.changeValues = {}
    this.units = {}
  }

  // Определяет есть ли у свойства единицы (px, em, ...) и сохраняет их в units
  // чтобы их можно было подставлять к значениям во время анимации
  private analyzeUnits() {
    if (this.target instanceof HTMLElement) {
      const computedStyle = getComputedStyle(this.target)

      for (const property in this.startValues) {
        const value = computedStyle.getPropertyValue(property)
        const match = value.match(/(\d+)(\D+)$/)

        this.units[property] = match ? match[2] : ''
      }
    }
  }

  private animate(timestamp: number) {
    cancelAnimationFrame(this.lastAnimateKey)

    if (!this.startTime) {
      this.startTime = timestamp
    }

    const elapsed = timestamp - this.startTime
    const progress = Math.min(elapsed / this.duration, 1)
    const easedProgress = this.easing(progress)

    for (const prop in this.changeValues) {
      const value =
        this.startValues[prop] + this.changeValues[prop] * easedProgress

      if (this.target instanceof HTMLElement) {
        this.target.style.setProperty(`${prop}`, `${value}${this.units[prop]}`)
      } else {
        this.target[prop] = value
      }

      this.tick && this.tick()
    }

    if (elapsed < this.duration) {
      this.lastAnimateKey = requestAnimationFrame(this.animate.bind(this))
    } else if (this.onComplete) {
      this.onComplete()
    }
  }

  public to(properties: Obj, duration: number, options?: Options) {
    this.duration = duration
    this.easing = options?.easing || this.easing
    this.startValues = {}
    this.changeValues = {}
    this.startTime = null
    this.tick = options?.tick || null
    this.onComplete = options?.onComplete || null

    for (const prop in properties) {
      if (this.target instanceof HTMLElement) {
        this.startValues[prop] = parseFloat(
          this.target.style.getPropertyValue(`${prop}`)
        )
      } else {
        this.startValues[prop] = this.target[prop]
      }

      this.changeValues[prop] = properties[prop] - this.startValues[prop]
    }

    this.analyzeUnits()
    requestAnimationFrame(timestamp => this.animate(timestamp))
  }

  public from(properties: Obj, duration: number, options?: Options) {
    const reversedProperties: Obj = {}

    for (const prop in properties) {
      reversedProperties[prop] = this.startValues[prop]
      this.startValues[prop] = properties[prop]
      this.changeValues[prop] = reversedProperties[prop] - properties[prop]
    }

    this.to(properties, duration, options)
  }

  public fromTo(
    fromProperties: Obj,
    toProperties: Obj,
    duration: number,
    options?: Options
  ) {
    this.to(toProperties, duration, options)
    this.startValues = fromProperties
    this.changeValues = {}

    for (const prop in toProperties) {
      this.changeValues[prop] = toProperties[prop] - fromProperties[prop]
    }
  }

  public pause(duration: number, options?: Options) {
    this.startTime = null
    this.duration = duration
    this.tick = options?.tick || null
    this.onComplete = options?.onComplete || null
    this.startValues = {}
    this.changeValues = {}

    requestAnimationFrame(timestamp => this.animate(timestamp))
  }
}
