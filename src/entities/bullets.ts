import { Pool } from 'kontra'
import { GROUND_Y, ITEM_TYPES } from './player'
import { Sprite } from './sprite'

const MAX_BULLETS = 50

export const Bullets = ({ particles }) => {
  let pool = Pool({
    create: () => new Bullet({ anchor: { x: 0.5, y: 0.5 } }),
    maxSize: MAX_BULLETS,
  })
  let activeItem: Bullet

  const spawn = (x: number, y: number, itemKey: string) => {
    const { health, size, damage, color } = ITEM_TYPES[itemKey]
    activeItem = pool.get({
      x,
      y,
      damage,
      color,
      health,
      active: false,
      ttl: Infinity,
      particles,
      width: size,
      height: size,
      maxHealth: health,
      anchor: { x: 0.5, y: 0.5 },
    }) as Bullet
    return activeItem
  }

  const shoot = (
    xSpeed = 0,
    ySpeed = 0,
    angle = 0,
    ddy = 0,
    ttl = Infinity,
    isEnemyBullet = false,
  ) => {
    activeItem.dx = xSpeed * Math.cos(angle)
    activeItem.dy = ySpeed * Math.sin(angle)
    activeItem.ddy = ddy
    activeItem.ttl = ttl
    activeItem.active = true
    activeItem.isEnemyBullet = isEnemyBullet
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
        size: this.width,
        ttl: 30,
      })
      this.dx = 0
      this.dy = 0
      this.ddy = 0
      this.ttl = 0
    }
  }

  draw() {
    this.context.translate(this.width / 2, this.height / 2)
    this.context.rotate(-(this._frame / 5))
    this.drawPath(
      'M11 21L22 34L29 27V51L33 56L36 51V27L42 34L53 21L42 9L36 16L33 13L29 16L22 9L11 21Z',
      '#000',
      this.color,
      1,
      -(this.width / 2),
      -(this.height / 2),
    )
    this.context.rotate(this._frame / 5)
    this.context.translate(-(this.width / 2), -(this.height / 2))
    this.drawDebug()
  }
}
