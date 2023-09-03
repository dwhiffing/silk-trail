import { emit, SpriteClass } from 'kontra'
import { ITEM_TYPES } from './player'

export class Sprite extends SpriteClass {
  constructor(properties = {}) {
    super({ anchor: { x: 0.5, y: 0.5 }, ...properties })
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
  items: string[]
  itemIndex: number
  money: number
  progress: number
  block: boolean
  constructor(properties) {
    super({ anchor: { x: 0, y: 1 }, ...properties })
    this.block = false
    this.money = 0
    this.itemIndex = 0
    this.progress = 0
    this.items = []
  }

  getMoney(amount: number) {
    this.money += amount
  }

  die() {
    super.die()
    emit('player-dead')
  }

  draw() {
    if (this.opacity === 0) return
    this.context.fillStyle = this.color
    this.context.beginPath()
    this.context.rect(0, 0, this.width, this.height)
    this.context.closePath()
    this.context.fill()

    if (this.items[this.itemIndex]) {
      const item = ITEM_TYPES[this.items[this.itemIndex]]
      this.context.fillStyle = item.color
      this.context.beginPath()
      this.context.rect(-10, -10, item.size, item.size)
      this.context.closePath()
      this.context.fill()
    }
  }
}
