import { lerp } from 'kontra'
import { Sprite } from './sprite'

export class Minimap extends Sprite {
  constructor(properties) {
    super({ anchor: { x: 0, y: 1 }, ...properties })
  }

  draw() {
    if (this.opacity === 0) return
    this.context.fillStyle = this.color
    this.context.beginPath()

    this.context.rect(
      lerp(0, 220, this.player.sprite.progress / (this.maxProgress ?? 1)),
      20,
      5,
      5,
    )
    this.context.rect(0, 28, 220, 1)
    this.context.closePath()
    this.context.fill()
  }
}
