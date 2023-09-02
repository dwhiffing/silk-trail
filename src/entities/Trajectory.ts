import { GRAVITY } from '../constants'
import { Sprite } from './sprite'

export class Trajectory {
  sprites: TrajectorySprite[]
  spawnTimer: number
  spawnTimerMax: number
  speed: number
  angle: number
  active: boolean

  constructor(properties) {
    this.sprites = []
    for (let i = 0; i < 50; i++) {
      this.sprites.push(new TrajectorySprite(properties))
    }
    this.spawnTimerMax = 20
    this.spawnTimer = 0
    this.active = false
    this.speed = properties.speed
    this.angle = properties.angle
  }

  show() {
    this.active = true
  }

  hide() {
    this.active = false
    this.sprites.forEach((s) => (s.opacity = 0))
  }

  update() {
    this.sprites.forEach((s) => s.update())
    if (!this.active) return

    this.spawnTimer--
    if (this.spawnTimer < 0) {
      this.spawnTimer = this.spawnTimerMax
      this.sprites.find((s) => s.opacity === 0)?.reset(this.speed, this.angle)
    }
  }

  render() {
    this.sprites.forEach((s) => s.render())
  }
}
export class TrajectorySprite extends Sprite {
  constructor(properties) {
    super({
      anchor: { x: 0, y: 0 },
      ...properties,
      dx: 0,
      dy: 0,
      ddy: 0,
      opacity: 0,
    })
    this.particles = properties.particles
    this.initialX = properties.x
    this.initialY = properties.y
    this.maxY = properties.maxY
    this.context.fillStyle = '#fff'
    this.context.beginPath()
    this.opacity = 0
  }

  update(dt?) {
    super.update(dt)

    if (this.opacity === 0) return
    const size = 2
    this.opacity -= 0.02
    if (this.y > this.maxY) {
      // this.particles.spawn({
      //   x: this.x + size / 2,
      //   y: this.maxY,
      //   size,
      //   ttl: 20,
      // })
      this.opacity = 0
    }
  }

  reset(speed, angle) {
    this.x = this.initialX
    this.y = this.initialY
    this.dx = speed * Math.cos(angle)
    this.dy = speed * Math.sin(angle)
    this.ddy = GRAVITY
    this.opacity = 1
  }

  draw() {
    // if (this.opacity === 0) return
    const size = 10
    this.context.beginPath()
    this.context.fillStyle = `rgba(255,255,255,${this.opacity})`
    this.context.arc(0, 0, size / 2, 0, Math.PI * 2)
    this.context.fill()
  }
}
