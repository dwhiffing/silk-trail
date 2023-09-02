import { SpriteClass } from 'kontra'

export class Sprite extends SpriteClass {
  constructor(properties) {
    super(properties)
  }

  takeDamage(n) {
    if (this.health <= 0) return

    if (n > 0) this.health -= n
    if (this.health <= 0) this.die()
    this.justDamaged = true
    setTimeout(() => (this.justDamaged = false), 100)
  }

  die() {
    this.ttl = 0
    this.opacity = this.isAlive() ? 1 : 0
  }

  update(dt?: number) {
    super.update(dt)
  }

  render() {
    super.render()
  }
}

export class ShipSprite extends Sprite {
  constructor(properties) {
    super({ anchor: { x: 0, y: 1 }, ...properties })
  }

  draw() {
    this.strobeTimer--
    const o = this.width / 2

    // base circle
    this.context.lineWidth = 3
    this.context.strokeStyle = '#222'
    this.context.fillStyle = '#999'
    this.context.beginPath()
    this.context.moveTo(o, o)
    this.context.rect(0, 0, this.width, this.height)
    this.context.closePath()
    this.context.stroke()
    this.context.fill()
  }
}
