import { GRAVITY } from '../constants'
import { Sprite } from './sprite'

export class Trajectory {
  angleSprite: AngleSprite
  spawnTimer: number
  spawnTimerMax: number
  speed: number
  angle: number
  active: boolean

  constructor(properties) {
    this.angleSprite = new AngleSprite(properties)
    this.active = false
    this.speed = properties.speed
    this.angle = properties.angle
  }

  show() {
    this.active = true
    this.angleSprite.opacity = 1
  }

  hide() {
    this.active = false
    this.angleSprite.opacity = 0
  }

  update() {
    this.angleSprite.angle = this.angle
    this.angleSprite.update()
    if (!this.active) return
  }

  render() {
    if (!this.active) return
    this.angleSprite.render()
  }
}
class AngleSprite extends Sprite {
  constructor(properties) {
    super({
      anchor: { x: 0, y: 0 },
      ...properties,
    })
    this.opacity = 1
  }

  update(dt?) {
    super.update(dt)
  }

  draw() {
    // if (this.opacity === 0) return
    console.log('asd', this.angle)
    const size = 5
    this.context.beginPath()
    this.context.lineWidth = 2
    this.context.strokeStyle = `#fff`
    this.context.moveTo(20 * Math.cos(this.angle), 20 * Math.sin(this.angle))
    this.context.lineTo(40 * Math.cos(this.angle), 40 * Math.sin(this.angle))
    this.context.stroke()
  }
}
