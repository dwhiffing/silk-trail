import { Enemy } from './enemy'
import { Pool, randInt } from 'kontra'
import { requestTimeout } from '../utils'

const MAX_ENEMIES = 50
export const Enemies = ({ canvas, particles, bullets }) => {
  let pool = Pool({ create: () => new Enemy(), maxSize: MAX_ENEMIES })
  let toSpawn = 0
  return {
    pool,
    getRemaining() {
      return toSpawn + pool.getAliveObjects().length
    },
    spawn(target, wave, delay = 0) {
      // TODO: refactor
      let { type = 'homer', count = 1, rate = 0 } = wave
      toSpawn += count
      for (let i = 0; i < count; i++) {
        let x, y

        const b = 50
        x = -b
        y = -b
        y = randInt(b, canvas.height - b)
        requestTimeout(
          () => {
            const ttl = Infinity
            pool.get({
              x,
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
