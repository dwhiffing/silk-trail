import { Pool } from 'kontra'
import { GROUND_Y, ITEM_TYPES } from '../constants'
import { Sprite } from './sprite'

export const Bullets = ({ particles }) => {
  let pool = Pool({
    create: () => new Bullet({ anchor: { x: 0.5, y: 0.5 } }),
    maxSize: 10,
  })

  const spawn = (x: number, y: number, itemKey: string) => {
    const { health, size, size2, damage, color } = ITEM_TYPES[itemKey]
    return pool.get({
      x,
      y,
      damage,
      color,
      health,
      type: itemKey,
      active: false,
      ttl: Infinity,
      particles,
      width: size,
      height: size,
      size: size2,
      maxHealth: health,
      anchor: { x: 0.5, y: 0.5 },
    }) as Bullet
  }

  const shoot = (
    item: Bullet,
    xSpeed = 0,
    ySpeed = 0,
    angle = 0,
    ddy = 0,
    ttl = Infinity,
    isEnemyBullet = false,
  ) => {
    item.dx = xSpeed * Math.cos(angle)
    item.dy = ySpeed * Math.sin(angle)
    item.ddy = ddy
    item.ttl = ttl
    item.active = true
    item.isEnemyBullet = isEnemyBullet
  }

  return { particles, pool, spawn, shoot }
}

export class Bullet extends Sprite {
  constructor(properties = {}) {
    super(properties)
  }

  init(props) {
    super.init(props)
    this.opacity = 1
  }

  update() {
    if (!this.active) {
      this._frame = 0
      return
    }
    super.update()
    if (this.ttl <= 0) return
    if (this.x < 0 || this.y > GROUND_Y) {
      this.particles?.spawn({
        x: this.x,
        y: this.y,
        size: this.width / 3,
        ttl: 30,
      })
      this.dx = 0
      this.dy = 0
      this.ddy = 0
      this.ttl = 0
    }
  }

  draw() {
    const s = this.width / 2
    this.context.translate(s, s)
    this.context.rotate(-(this._frame / 5))
    if (this.type === 'bag') {
      this.drawPath(
        'M26 50L19 47L20 29L23 23L29 19H38L44 23L46 29L47 47L42 50L34 51L26 50Z',
        '#000',
        this.color,
        0,
        s * -2,
        s * -2,
      )
      this.drawPath(
        'M38 15H29L26 9H40L38 15Z',
        '#000',
        this.color,
        0,
        s * -2,
        s * -2,
      )
      this.drawPath('M28 17H38.5', 'transparent', 'red', 0, s * 0.5, s * 0.5)
    } else if (this.type === 'gem') {
      this.drawPath(
        'M32 8L53 20L53 44L32 56L11 44V20L20 25L11 20L32 8Z',
        'transparent',
        this.color,
        0,
        -(s * 2),
        -(s * 2),
      )
      this.drawPath(
        'M11 20L32 8M11 20V44M11 20L20 25M32 8L53 20M32 8V18M53 20V44M53 20L44 25M53 44L32 56M53 44L44 39M32 56L11 44M32 56V46M11 44L20 39M20 25V39M20 25L32 18M20 39L32 46M32 46L44 39M44 39V25M44 25L32 18',
        '#000',
        'transparent',
        0,
        -(s * 2),
        -(s * 2),
      )
    } else if (this.type === 'ingot') {
      this.drawPath(
        'M1 20L3.5 10.5L17 0.5H25.5L28.5 9L17 20H1Z',
        'transparent',
        this.color,
        0,
        -10,
        -10,
      )
      this.drawPath(
        'M3.5 10.5L1 20H17M3.5 10.5H13.5M3.5 10.5L17 0.5H25.5M13.5 10.5L17 20M13.5 10.5L25.5 0.5M17 20L28.5 9L25.5 0.5',
        '#000',
        'transparent',
        0,
        -10,
        -10,
      )
    } else if (this.type === 'axe') {
      this.drawPath(
        'M11 21L22 34L29 27V51L33 56L36 51V27L42 34L53 21L42 9L36 16L33 13L29 16L22 9L11 21Z',
        '#000',
        this.color,
        1,
        -(this.size / 2),
        -(this.size / 2),
      )
    }
    this.context.rotate(this._frame / 5)
    this.context.translate(-s, -s)
    this.drawDebug()
    this.drawShadow()
  }
}
