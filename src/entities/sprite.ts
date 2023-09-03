import { emit, SpriteClass } from 'kontra'

export class Sprite extends SpriteClass {
  constructor(properties = {}) {
    super({ anchor: { x: 0.5, y: 0.5 }, ...properties })
  }

  takeDamage(n) {
    if (this.health <= 0) return

    if (n > 0) this.health -= n
    if (this.health <= 0) this.die()
  }

  die() {
    this.ttl = 0
    this.opacity = 0
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
    if (this.opacity === 0) return
    this.context.fillStyle = this.color
    this.context.beginPath()
    this.context.rect(0, 0, this.width, this.height)
    this.context.closePath()
    this.context.fill()
  }
}

export class PlayerSprite extends ShipSprite {
  constructor(properties) {
    super({ anchor: { x: 0, y: 1 }, ...properties })
  }

  die() {
    super.die()
    emit('player-dead')
  }
}
