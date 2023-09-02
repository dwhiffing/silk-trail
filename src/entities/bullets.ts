import { Pool } from 'kontra'
import { GROUND_Y } from './player'
import { Sprite } from './sprite'

const MAX_BULLETS = 50

export const Bullets = ({ particles }) => {
  let pool = Pool({ create: () => new Bullet(), maxSize: MAX_BULLETS })

  return {
    particles,
    pool,
    spawn(opts) {
      const { health, speed = 0, angle = 0 } = opts
      return pool.get({
        x: opts.x,
        y: opts.y,
        anchor: { x: 0.5, y: 0.5 },
        width: opts.size || 0,
        height: opts.size || 0,
        dx: speed * Math.cos(angle),
        dy: speed * Math.sin(angle),
        ddy: opts.ddy || 0,
        ttl: opts.ttl || Infinity,
        damage: opts.damage,
        maxHealth: health,
        health,
        particles: particles,
      })
    },
  }
}

class Bullet extends Sprite {
  constructor(properties = {}) {
    super(properties)
  }

  init(props) {
    super.init(props)
    this.opacity = 1
    this.angle = 0
  }

  update() {
    super.update()
    if (this.ttl <= 0) return
    this.angle += 0.07
    if (this.x < 0 || this.y > GROUND_Y) {
      this.particles?.spawn({
        x: this.x,
        y: this.y,
        size: this.width,
        ttl: 30,
      })
      this.angle = 0
      this.dx = 0
      this.dy = 0
      this.ddy = 0
      this.ttl = 0
    }
  }

  draw() {
    this.context.beginPath()
    // this.context.rotate(this.angle)
    this.context.rect(0, 0, this.width * 1.5, this.width * 1.5)
    // this.context.rotate(0)
    this.context.fill()
  }
}
