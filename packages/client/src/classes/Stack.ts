export default class Stack {
  private readonly length: number
  public stack: any[]

  constructor(length: number) {
    this.length = length
    this.stack = []
  }

  public push(item: unknown): void {
    if (this.stack.length === this.length) {
      this.stack.pop()
    }

    this.stack.unshift(item)
  }

  public getStack() {
    return this.stack
  }

  public getLength() {
    return this.length
  }

  public clear() {
    this.stack = []
  }
}
