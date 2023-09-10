import { SpriteClass } from 'kontra'

export class Sprite extends SpriteClass {
  health: number

  constructor(properties: any = {}) {
    super({ anchor: { x: 0.5, y: 1 }, ...properties })
    this.health = properties?.health ?? 10
    this._frame = 0
  }

  takeDamage(n) {
    if (this.health <= 0 || this.block) return

    if (n > 0) this.health -= n
    if (this.health <= 0) this.die()
  }

  die() {
    this.ttl = 0
    this.opacity = 0
  }

  drawPath(
    _path: string,
    strokeStyle?: string,
    fillStyle?: string,
    lineWidth = 1,
    x = 0,
    y = 0,
  ) {
    let path = new Path2D(_path)
    this.context.translate(x, y)
    if (fillStyle) {
      this.context.fillStyle = fillStyle
      this.context.fill(path)
    }
    if (strokeStyle) {
      this.context.strokeStyle = strokeStyle
      this.context.lineWidth = lineWidth
      this.context.stroke(path)
    }
    this.context.translate(-x, -y)
  }

  drawDebug() {
    this.context.strokeStyle = '#0f0'
    this.context.lineWidth = 1
    this.context.beginPath()
    let x = this.width * -this.anchor.x
    let y = this.height * -this.anchor.y
    this.context.rect(0, 0, this.width, this.height)
    this.context.closePath()
    this.context.stroke()
    this.context.fillStyle = '#f00'
    this.context.strokeStyle = '#fff'
    this.context.lineWidth = 1
    this.context.beginPath()
    this.context.rect(-2.5 + x * -1, -2.5 + y * -1, 5, 5)
    this.context.closePath()
    this.context.stroke()
    this.context.fill()
  }

  update(dt?: number) {
    super.update(dt)
    this._frame++
  }

  render() {
    super.render()
  }
}
