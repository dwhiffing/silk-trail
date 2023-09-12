import { Pool } from 'kontra'
import { Sprite } from './sprite'

export const Particles = () => {
  let pool = Pool({ create: () => new Particle(), maxSize: 200 })
  return {
    pool,
    spawn({ x, y, size = 1, ttl = 50, opacity = 1 }) {
      pool.get({ x, y, width: size, ttl, opacity, initialOpacity: opacity })
    },
  }
}

class Particle extends Sprite {
  constructor(properties = {}) {
    super({ ...properties })
  }

  update() {
    super.update()
    this.opacity -= this.initialOpacity / this.ttl
  }

  draw() {
    this.context.rect(-this.width, -this.width, this.width * 2, this.width * 2)
    var g = this.context.createRadialGradient(
      -this.width + this.width,
      -this.width + this.width,
      this.width / 1.5,
      -this.width + this.width,
      -this.width + this.width,
      this.width,
    )
    g.addColorStop(0, `rgba(255,255,255,${this.opacity})`)
    g.addColorStop(1, `rgba(255,255,255,0)`)
    this.context.fillStyle = g
    this.context.fill()
  }
}
