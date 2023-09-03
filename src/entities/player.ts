import { emit, onKey, onPointer } from 'kontra'
import { PlayerSprite } from './sprite'
import { Trajectory } from './Trajectory'

export const GRAVITY = 0.175
export const GROUND_Y = 150
const MIN_SPEED = 3
const MAX_SPEED = 8
const SIZE = 35
const MIN_ANGLE = 3.2
const MAX_ANGLE = 4
const BASE_MOVEMENT_SPEED = 0.0001
const BASE_SPEED_CHANGE = 0.12
const BASE_ANGLE_CHANGE = 0.02
const MAX_HP = 5

export const ITEM_TYPES = {
  stone: { size: 10, damage: 10, weight: 0.8, value: 1, color: '#fff' },
  box: { size: 20, damage: 10, weight: 1.2, value: 1, color: '#ff0' },
}

export const Player = ({ canvas, data, bullets, particles, enemies }) => {
  let sprite = new PlayerSprite({
    x: canvas.width - 40,
    y: GROUND_Y,
    color: '#666',
    width: SIZE * 2,
    height: SIZE,
    health: MAX_HP,
    maxHealth: MAX_HP,
  })
  let angle = 0
  let speed = 0
  let canBlock = true
  sprite.itemIndex = 0
  sprite.progress = 0
  sprite.data = data
  let movementSpeed = BASE_MOVEMENT_SPEED
  let updateTrajectory = (_angle, _speed) => {
    angle = _angle
    speed = _speed
    trajectory.angle = _angle

    const itemKey = data.items[sprite.itemIndex]
    const item = ITEM_TYPES[itemKey]
    trajectory.speed = _speed * (1 / item.weight)
  }
  let trajectory = new Trajectory({
    x: sprite.x,
    y: sprite.y - SIZE,
    angle: 0,
    speed: 0,
  })

  const onThrow = () => {
    if (data.items.length === 0) return
    if (trajectory.stage === 0) {
      updateTrajectory(MIN_ANGLE, MIN_SPEED)
    } else if (trajectory.stage === 1) {
    } else if (trajectory.stage === 2) {
      const itemKey = data.items[sprite.itemIndex]
      const item = ITEM_TYPES[itemKey]
      data.items = data.items.filter((s, i) => i !== sprite.itemIndex)
      if (sprite.itemIndex > 0) sprite.itemIndex--
      bullets.spawn({
        x: sprite.x,
        y: sprite.y - SIZE,
        ddy: GRAVITY,
        angle,
        speed: trajectory.speed,
        size: item.size,
        color: item.color,
        damage: item.damage,
        health: 10,
      })
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
      sprite.progress += movementSpeed
      if (sprite.progress >= 1) emit('level-end')
      if (trajectory.stage === 0) return

      if (trajectory.stage === 1) {
        if (angle > MAX_ANGLE || angle < MIN_ANGLE) {
          direction = direction === -1 ? 1 : -1
        }
        updateTrajectory(angle + direction * BASE_ANGLE_CHANGE, speed)
      } else if (trajectory.stage === 2) {
        if (speed > MAX_SPEED || speed < MIN_SPEED) {
          direction = direction === -1 ? 1 : -1
        }

        updateTrajectory(angle, speed + direction * BASE_SPEED_CHANGE)
      }
    },
    shutdown() {},
  }
}
