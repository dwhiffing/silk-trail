import { emit, onKey, onPointer } from 'kontra'
import * as constants from '../constants'
import { Sprite } from './sprite'
import { Trajectory } from './Trajectory'

export const Player = ({ canvas, data, bullets, particles, enemies }) => {
  let sprite = new PlayerSprite({
    x: canvas.width - 70,
    y: constants.GROUND_Y - constants.SIZE / 3,
    color: '#666',
    width: constants.SIZE,
    height: constants.SIZE,
    health: constants.MAX_HP,
    maxHealth: constants.MAX_HP,
  })
  let angle = 0
  let speed = 0
  let canBlock = true
  sprite.itemIndex = 0
  sprite.progress = 0
  sprite.data = data
  const _x = () => sprite.x - constants.SIZE * 0.5
  const _y = () => sprite.y - constants.SIZE * 1.5
  let updateTrajectory = (_angle, _speed) => {
    angle = _angle
    speed = _speed
    trajectory.angle = _angle

    const itemKey = data.items[sprite.itemIndex]
    const item = constants.ITEM_TYPES[itemKey]
    trajectory.speed = _speed * (1 / item.weight)
  }
  let trajectory = new Trajectory({
    x: _x(),
    y: _y(),
    angle: 0,
    speed: 0,
  })

  const getItem = () => {
    const itemKey = data.items[sprite.itemIndex]
    data.items = data.items.filter((s, i) => i !== sprite.itemIndex)
    if (sprite.itemIndex > 0) sprite.itemIndex--
    bullets.spawn(_x(), _y(), itemKey)
  }
  getItem()

  const onThrow = () => {
    if (data.items.length === 0) return
    if (trajectory.stage === 0) {
      updateTrajectory(constants.MIN_ANGLE, constants.MIN_SPEED)
    } else if (trajectory.stage === 1) {
    } else if (trajectory.stage === 2) {
      bullets.shoot(
        trajectory.speed,
        trajectory.speed,
        angle,
        constants.GRAVITY,
      )
      getItem()
    }
    trajectory.stage++
    if (trajectory.stage === 3) {
      trajectory.stage = 0
    }
  }

  const onBlock = () => {
    if (trajectory.stage !== 0 || !canBlock) return
    sprite.color = '#00f'
    sprite.block = true
    canBlock = false
    emit('delay', 'block', 20, () => {
      sprite.block = false
      sprite.color = '#333'
      emit('delay', 'allow-block', 60, () => {
        sprite.color = '#666'
        canBlock = true
      })
    })
  }

  const onSwap = () => {
    if (trajectory.stage !== 0) trajectory.stage = 0
    sprite.itemIndex++
    if (sprite.itemIndex > data.items.length - 1) sprite.itemIndex = 0
  }

  onKey('space', (e) => !e.repeat && onBlock())
  onKey('z', (e) => !e.repeat && onSwap())
  onPointer('down', onThrow)

  let direction = -1
  return {
    sprite,
    trajectory,
    update() {
      sprite.update()
      trajectory.update()
      sprite.progress += constants.BASE_MOVEMENT_SPEED * sprite.speed
      if (sprite.progress >= constants.LEVELS[data.levelIndex].totalLength)
        emit('level-end')
      const totalWeight = data.items
        .map((k) => constants.ITEM_TYPES[k].weight)
        .reduce((sum, n) => sum + n, 0)

      const ratio = 1 - totalWeight / constants.MAX_WEIGHT
      sprite.speed = constants.MAX_WAGON_SPEED * ratio

      if (trajectory.stage === 0) return

      if (trajectory.stage === 1) {
        if (angle > constants.MAX_ANGLE || angle < constants.MIN_ANGLE) {
          direction = direction === -1 ? 1 : -1
        }
        updateTrajectory(angle + direction * constants.BASE_ANGLE_CHANGE, speed)
      } else if (trajectory.stage === 2) {
        if (speed > constants.MAX_SPEED || speed < constants.MIN_SPEED) {
          direction = direction === -1 ? 1 : -1
        }

        updateTrajectory(angle, speed + direction * constants.BASE_SPEED_CHANGE)
      }
    },
    shutdown() {},
  }
}

class PlayerSprite extends Sprite {
  itemIndex: number
  progress: number
  speed: number
  block: boolean
  constructor(properties) {
    super({ ...properties })
    this.block = false
    this.itemIndex = 0
    this.progress = 0
    this.speed = 4.5
  }

  die() {
    super.die()
    emit('player-dead')
  }

  draw() {
    if (this.opacity === 0) return

    const s = constants.SIZE / 2
    this.context.translate(s, s * 2)
    this.context.translate(5, -20)
    this.context.rotate(this._frame / 10 + 0.5)
    this.drawPath(
      'M16 16L85 85M85 16L16 85M51 2V99M99 50H2',
      '#501502',
      '#7D1F01',
      6,
      -s,
      -s,
    )
    this.context.rotate(-(this._frame / 10 + 0.5))

    this.drawPath(
      'M100.5 51C100.5 78.6142 78.6142 100.5 51 100.5C23.3728 100.5 0.5 78.6014 0.5 51C0.5 23.3858 23.3858 0.5 51 0.5C78.6014 0.5 100.5 23.3728 100.5 51ZM51 95.5C75.8528 95.5 95.5 75.8528 95.5 51C95.5 26.1619 75.8673 5.5 51 5.5C26.1472 5.5 5.5 26.1472 5.5 51C5.5 75.8673 26.1619 95.5 51 95.5Z',
      '#000',
      '#7D1F01',
      1,
      -s,
      -s,
    )
    this.context.translate(-5, 20)
    this.context.translate(-s, -(s * 2))

    this.drawPath('M19 67H142L158 1H1L19 67Z', '#000', '#7D1F01', 2, -30, 25)
    this.context.translate(s, s * 2)
    this.context.rotate(this._frame / 10)
    this.drawPath(
      'M16 16L85 85M85 16L16 85M51 2V99M99 50H2',
      '#501502',
      '#7D1F01',
      6,
      -s,
      -s,
    )
    this.context.rotate(-(this._frame / 10))

    this.drawPath(
      'M100.5 51C100.5 78.6142 78.6142 100.5 51 100.5C23.3728 100.5 0.5 78.6014 0.5 51C0.5 23.3858 23.3858 0.5 51 0.5C78.6014 0.5 100.5 23.3728 100.5 51ZM51 95.5C75.8528 95.5 95.5 75.8528 95.5 51C95.5 26.1619 75.8673 5.5 51 5.5C26.1472 5.5 5.5 26.1472 5.5 51C5.5 75.8673 26.1619 95.5 51 95.5Z',
      '#000',
      '#7D1F01',
      1,
      -s,
      -s,
    )
    this.context.translate(-s, -(s * 2))

    this.drawDebug()
  }
}
