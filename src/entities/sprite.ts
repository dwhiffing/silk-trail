import { movePoint, SpriteClass } from 'kontra'
import { GRAVITY } from '../constants'
import { playSound } from '../utils'

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

function getRads(degrees) {
  return (Math.PI * degrees) / 180
}
