import { Pool } from 'kontra'
import { requestTimeout } from '../utils'
import { GROUND_Y } from './player'
import { ShipSprite } from './sprite'

export const Enemies = ({ canvas, particles, bullets }) => {
  let pool = Pool({ create: () => new Enemy(), maxSize: 10 })
  let toSpawn = 0
  return {
    pool,
    getRemaining() {
      return toSpawn + pool.getAliveObjects().length
    },
    spawn(target, wave, delay = 0) {
      let { type = 'homer', count = 1, rate = 0 } = wave
      toSpawn += count
      let x = 50
      let y = GROUND_Y
      for (let i = 0; i < count; i++) {
        requestTimeout(
          () => {
            const ttl = Infinity
            pool.get({
              x: x + i * 80,
              y,
              ttl,
              target,
              pool,
              bullets,
              particles,
              type,
            })
            toSpawn--
          },
          delay + i * rate,
        )
      }
    },
  }
}

class Enemy extends ShipSprite {
  constructor(properties = {}) {
    super(properties)
  }

  init(properties) {
    super.init({
      color: '#f00',
      width: 25,
      height: 25,
      exhaust: true,
      explodes: true,
      maxSpeed: 4.2,
      speed: 1,
      health: 10,
      damage: 10,
      separateAmount: 30,
      value: 5,
      ...properties,
      anchor: { x: 0, y: 1 },
    })
  }

  update() {
    super.update()
  }

  die() {
    // playSound('enemyExplode')
    this.particles.spawn({
      x: this.x + this.width / 2,
      y: this.y - this.width / 2,
      size: this.width,
      ttl: 50,
    })

    super.die()
  }
}
