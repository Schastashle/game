import { easings, EasingFunction } from './easings'

type Obj = Record<string, number>

export default class Animation {
  private target: HTMLElement | Obj
  private startTime: number | null
  private duration: number
  private easingFunction: EasingFunction
  private onComplete: (() => void) | null
  private startValues: Obj
  private changeValues: Obj
  private units: Record<string, string>

  constructor(target: HTMLElement | Obj, duration: number) {
    this.target = target
    this.startTime = null
    this.duration = duration
    this.easingFunction = easings.linear
    this.onComplete = null
    this.startValues = {}
    this.changeValues = {}
    this.units = {}
  }

  // Определяет есть ли у свойства единицы (px, em, ...) и сохраняет их в units
  // чтобы их можно было подставлять к значениям во время анимации
  private analyzeUnits() {
    if (this.target instanceof HTMLElement) {
      const computedStyle = getComputedStyle(this.target)

      for (const prop in this.startValues) {
        const value = computedStyle.getPropertyValue(`${prop}`)
        const match = value.match(/(\d+)(\D+)$/)

        if (match) {
          this.units[prop] = match[2]
        } else {
          this.units[prop] = ''
        }
      }
    }
  }

  private animate(timestamp: number) {
    if (!this.startTime) {
      this.startTime = timestamp
    }

    const elapsed = timestamp - this.startTime
    const progress = Math.min(elapsed / this.duration, 1)
    const easedProgress = this.easingFunction(progress)

    for (const prop in this.changeValues) {
      const value =
        this.startValues[prop] + this.changeValues[prop] * easedProgress

      if (this.target instanceof HTMLElement) {
        this.target.style.setProperty(`${prop}`, `${value}${this.units[prop]}`)
      } else {
        this.target[prop] = value
      }
    }

    if (elapsed < this.duration) {
      requestAnimationFrame(timestamp => this.animate(timestamp))
    } else {
      if (this.onComplete) {
        this.onComplete()
      }
    }
  }

  public to(
    properties: Obj,
    duration?: number,
    onComplete?: () => void,
    easingFunction?: EasingFunction
  ) {
    this.duration = duration || this.duration
    this.easingFunction = easingFunction || this.easingFunction
    this.startValues = {}
    this.changeValues = {}
    this.startTime = null
    this.onComplete = onComplete || null

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

  public from(
    properties: Obj,
    duration?: number,
    onComplete?: () => void,
    easingFunction?: EasingFunction
  ) {
    const reversedProperties: Obj = {}

    for (const prop in properties) {
      reversedProperties[prop] = this.startValues[prop]
      this.startValues[prop] = properties[prop]
      this.changeValues[prop] = reversedProperties[prop] - properties[prop]
    }

    this.to(properties, duration, onComplete, easingFunction)
  }

  public fromTo(
    fromProperties: Obj,
    toProperties: Obj,
    duration?: number,
    onComplete?: () => void,
    easingFunction?: EasingFunction
  ) {
    this.to(toProperties, duration, onComplete, easingFunction)
    this.startValues = fromProperties
    this.changeValues = {}

    for (const prop in toProperties) {
      this.changeValues[prop] = toProperties[prop] - fromProperties[prop]
    }
  }

  public pause(duration?: number, onComplete?: () => void) {
    this.startTime = null
    this.duration = duration || this.duration
    this.onComplete = onComplete || null
    this.startValues = {}
    this.changeValues = {}

    requestAnimationFrame(timestamp => this.animate(timestamp))
  }
}
