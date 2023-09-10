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
        dx: (opts.xSpeed || speed) * Math.cos(angle),
        dy: (opts.ySpeed || speed) * Math.sin(angle),
        ddy: opts.ddy || 0,
        ttl: opts.ttl || Infinity,
        damage: opts.damage,
        color: opts.color,
        isEnemyBullet: opts.isEnemyBullet,
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
    this.context.fillStyle = this.color
    // this.context.rect(0, 0, this.width, this.width)
    // this.context.rotate(0)
    // this.context.fill()
    var path = new Path2D(
      'M1 5.74725L4.27273 10.4945L6.27273 8.0467V17.2198L7.18182 19L8.03409 17.2198V8.0467L9.90909 10.4945L13 5.74725L9.90909 1L8.03409 3.71978L7.18182 2.38462L6.27273 3.71978L4.27273 1L1 5.74725Z',
    )
    this.context.scale(4.5, 4.5)
    this.context.stroke(path)
    this.context.fill(path)
  }
}
