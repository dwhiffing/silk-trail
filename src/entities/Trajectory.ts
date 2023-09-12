import { emit, Pool } from 'kontra'
import { GRAVITY } from '../constants'
import { Sprite } from './sprite'

export class Trajectory {
  sprites: Pool
  angleSprite: AngleSprite
  speed: number
  stage: number
  angle: number

  constructor(properties) {
    // this.sprites = Pool({
    //   create: () => new TrajectorySprite(properties),
    //   maxSize: 10,
    // })
    this.angleSprite = new AngleSprite(properties)
    this.stage = 0
    this.speed = properties.speed
    this.angle = properties.angle
    // emit('delay', 'spawn', 20, () => this.spawn())
  }

  // spawn() {
  // @ts-ignore
  // this.sprites.get()?.reset(this.speed, this.angle)
  // emit('delay', 'spawn', 20, () => this.spawn())
  // }

  update() {
    // this.sprites.update()
    this.angleSprite.opacity = this.stage > 0 ? 1 : 0
    this.angleSprite.opacity = this.stage > 0 ? 1 : 0
    if (this.stage === 0) {
      return
    }

    this.angleSprite.angle = this.angle
    this.angleSprite.speed = this.speed
    this.angleSprite.update()
  }

  render() {
    if (this.stage === 0) return
    // if (this.stage === 2) this.sprites.render()
    this.angleSprite.render()
  }
}
class AngleSprite extends Sprite {
  constructor(properties = {}) {
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
    const s = 0
    const d = 50 + 50 * ((this.speed - 4) / 11)

    this.context.beginPath()
    this.context.lineWidth = 10
    this.context.strokeStyle = `#000`
    this.context.moveTo(s * Math.cos(this.angle), s * Math.sin(this.angle))
    this.context.lineTo(
      (s + d) * Math.cos(this.angle),
      (s + d) * Math.sin(this.angle),
    )
    this.context.stroke()
  }
}

// class TrajectorySprite extends Sprite {
//   constructor(properties: any = {}) {
//     super({
//       anchor: { x: 0, y: 0 },
//       ...properties,
//       dx: 0,
//       dy: 0,
//       ddy: 0,
//       opacity: 0,
//     })
//     this.particles = properties.particles
//     this.initialX = properties.x
//     this.initialY = properties.y
//     this.maxY = properties.maxY
//     this.context.fillStyle = '#fff'
//     this.context.beginPath()
//     this.opacity = 0
//     this.ttl = 0
//   }

//   update(dt?) {
//     super.update(dt)

//     if (this.opacity <= 0) this.ttl = 0
//     if (this.opacity === 0) return
//     this.opacity -= 0.015
//     if (this.y > this.maxY) {
//       this.opacity = 0
//       this.ttl = 0
//     }
//   }

//   reset(speed, angle) {
//     this.x = this.initialX
//     this.y = this.initialY
//     this.dx = speed * Math.cos(angle)
//     this.dy = speed * Math.sin(angle)
//     this.ddy = GRAVITY
//     this.opacity = 0.7
//   }

//   draw() {
//     const size = 40
//     this.context.beginPath()
//     this.context.fillStyle = `rgba(255,255,255,${this.opacity})`
//     this.context.arc(0, 0, size / 2, 0, Math.PI * 2)
//     this.context.fill()
//   }
// }
