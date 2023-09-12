import { emit, Pool, randInt } from 'kontra'
import { requestTimeout } from '../utils'
import {
  ATTACK_RANGE,
  ENEMY_BUFFER,
  GRAVITY,
  GROUND_Y,
  PLAYER_BUFFER,
} from '../constants'
import { Sprite } from './sprite'

export const Enemies = ({ canvas, level, particles, bullets }) => {
  let pool = Pool({ create: () => new Enemy(), maxSize: 10 })
  let toSpawn = 0
  let target
  let waveIndex = 0
  let wave = level.waves[waveIndex]
  const attack = () => {
    const enemies = pool.getAliveObjects() as Enemy[]
    const inRange = enemies.filter((e) => target.x - e.x < ATTACK_RANGE)

    const index = randInt(0, inRange.length - 1)
    inRange[index]?.attack()
    emit('delay', 'attack', 600 / (enemies.length + 1), attack)
  }
  const spawn = (target, wave, delay = 0) => {
    let { count = 1 } = wave
    toSpawn += count
    let x = -25
    let y = GROUND_Y - 60
    for (let i = 0; i < count; i++) {
      requestTimeout(
        () => {
          const ttl = Infinity
          pool.get({
            x: x + i * -80,
            y,
            ttl,
            target,
            pool,
            bullets,
            particles,
          })
          toSpawn--
        },
        delay + i * 0,
      )
    }
  }
  emit('delay', 'attack', 10, attack), 0
  return {
    pool,
    update(player) {
      target = player.sprite
      const _enemies = (pool.getAliveObjects() as any[]).sort(
        (a, b) => a.x - b.x,
      )
      _enemies.forEach((enemy: any) => {
        const enemyInFront = _enemies.find((e) => e.x > enemy.x) || target
        const distToNeighbour = enemyInFront.x - enemy.x
        enemy.dx =
          distToNeighbour >
          (enemyInFront !== target ? ENEMY_BUFFER : PLAYER_BUFFER)
            ? enemy.speed - target.speed
            : 0
      })
      if (wave && target.progress / level.totalLength > wave.progress) {
        spawn(player, wave)
        wave = level.waves[++waveIndex]
      }
    },
    getRemaining() {
      return toSpawn + pool.getAliveObjects().length
    },
    attack,
    spawn,
  }
}

class CamelRiderSprite extends Sprite {
  constructor(properties) {
    super({ ...properties })
    this._frame = 0
  }

  draw() {
    if (this.opacity === 0) return

    const k = 30
    const x2 = this.width * -3
    const y2 = this.height * -0.4
    this.context.translate(x2, y2)
    const index = Math.round((this._frame % k) / k)
    this.drawPath(
      index === 0
        ? 'M11 216L6 205L24 169L53 146L64 120L104 95L147 91L172 106L190 111L207 103L221 91L216 84L212 77L220 79L223 84L236 86L247 88L254 95L252 99L241 101L229 110L212 120L194 127L180 135L200 153L227 178L236 176L237 178L232 185L225 187L202 166L198 189V194L194 200H190L194 187L197 161L190 155L180 152L159 144L127 147L104 135L96 151L78 182L93 216L104 221L105 225H93L69 182L78 158V146L33 169L13 205L16 212L11 216Z'
        : 'M99 189L94 192L73 189L89 203H94L91 209L85 207L56 184L59 168L58 153L55 142L67 108L90 91L118 84L155 89L191 112L212 108L228 96L223 89L219 82L226 84L230 89L243 91L254 93L261 100L259 103L248 105L224 119L206 128L189 130L175 142L171 186L136 197V202L135 205H129V197L160 181V146L138 170L131 177L124 205L116 204L111 200L120 195H124L127 170L149 141L87 135L78 153L73 180L94 186L96 183L99 189Z',
      '#84530A',
      this.color,
      1,
    )

    const y = index === 0 ? -5 : 1
    const x = index === 0 ? -10 : -5
    this.context.translate(x, y)
    this.drawPath(BODY_PATH, '#B6AC88', 'white', 1)
    this.drawPath(FACE_PATH, '#84530A', '#DEA248', 1)
    this.drawPath('M164 82L227 103', '#84530A', undefined, 3)
    this.context.translate(-x, -y)
    this.context.translate(-x2, -y2)
    this.drawDebug()
  }
}

export const BODY_PATH =
  'M131 106L149 125L166 126L165 95L160 87L163 82L142 53L139 40L147 30L139 23L128 28L127 44L131 88V106Z'

export const FACE_PATH = 'M143 32H135V41L141 44L143 37L145 38L143 32Z'

class Enemy extends CamelRiderSprite {
  constructor(properties = {}) {
    super(properties)
  }

  init(properties) {
    super.init({
      color: '#F58328',
      width: 40,
      height: 80,
      speed: 5,
      health: 10,
      damage: 10,
      ...properties,
      anchor: { x: 0.5, y: 1 },
    })
  }

  attack() {
    this.color = '#f00'
    const xValues = [5, 8, 10]
    const yValues = [12, 12, 14]
    const index = Math.floor((this.target.sprite.x - this.x) / 250) - 1

    emit('delay', 'color', 10, () => {
      this.color = '#F58328'
      let item
      if (this.ttl > 0) item = this.bullets.spawn(this.x, this.y - 40, 'axe')
      this.bullets.shoot(
        item,
        xValues[index],
        yValues[index],
        5.5,
        GRAVITY,
        Infinity,
        true,
      )
    })
  }

  die() {
    // playSound('enemyExplode')
    this.particles.spawn({
      x: this.x + this.width / 2,
      y: this.y - this.width / 2,
      size: this.width,
      ttl: 0,
    })

    super.die()
  }
}
