import { angleToTarget, movePoint, Pool } from 'kontra'
import { getSpeed, gradient } from '../utils'
import { Sprite } from './sprite'

const MAX_BULLETS = 50

export const Bullets = ({ particles, maxY }) => {
  let pool = Pool({ create: () => new Bullet(), maxSize: MAX_BULLETS })

  return {
    particles,
    pool,
    spawn(opts) {
      const { health, speed = 0, angle = 0, enemies, isEnemyBullet } = opts
      return pool.get({
        x: opts.x,
        y: opts.y,
        anchor: { x: 0.5, y: 0.5 },
        width: opts.triggerRadius || opts.size || 0,
        height: opts.triggerRadius || opts.size || 0,
        dx: speed * Math.cos(angle),
        dy: speed * Math.sin(angle),
        ddx: opts.ddx || 0,
        ddy: opts.ddy || 0,
        size: opts.size || 0,
        innerSize: opts.innerSize,
        originalSize: opts.size || 0,
        explodeRadius: opts.explodeRadius || 0,
        triggerDuration: opts.triggerDuration || 0,
        isMine: opts.isMine || 0,
        ttl: opts.ttl || Infinity,
        triggered: false,
        damage: opts.damage,
        enemies,
        maxHealth: health,
        health,
        maxY,
        particles: particles,
        isEnemyBullet,
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
  }

  update() {
    super.update()
    this.rotation += 0.07
    if (this.x < 0 || this.y > this.maxY) {
      if (this.dx === 0) return
      this.particles?.spawn({
        x: this.x,
        y: this.maxY,
        size: this.size * 2,
        ttl: 30,
      })
      this.rotation = 0
      this.dx = 0
      this.dy = 0
      this.ddy = 0
      this.ttl = 0
    }
  }

  draw() {
    const size = 20
    this.context.beginPath()
    this.context.rect(-size / 2, -size / 2, size, size)
    this.context.fill()
  }
}
