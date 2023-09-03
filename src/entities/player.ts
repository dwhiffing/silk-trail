import { onKey, onPointer } from 'kontra'
import { PlayerSprite } from './sprite'
import { Trajectory } from './Trajectory'

export const GRAVITY = 0.175
export const GROUND_Y = 150
const MIN_SPEED = 3
const MAX_SPEED = 8
const SIZE = 35
const BULLET_SIZE = 10
const MIN_ANGLE = 3.8
const MAX_ANGLE = 4.6
const MAX_HP = 5

export const Player = ({ canvas, bullets, particles, enemies }) => {
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
  let updateTrajectory = (_angle, _speed) => {
    angle = _angle
    speed = _speed
    trajectory.angle = _angle
    trajectory.speed = _speed
  }
  let trajectory = new Trajectory({
    x: sprite.x,
    y: sprite.y - SIZE,
    angle: 0,
    speed: 0,
  })

  const onClick = () => {
    if (trajectory.stage === 0) {
      updateTrajectory(MIN_ANGLE, MIN_SPEED)
    } else if (trajectory.stage === 1) {
    } else if (trajectory.stage === 2) {
      bullets.spawn({
        x: sprite.x,
        y: sprite.y - SIZE,
        ddy: GRAVITY,
        angle,
        speed,
        size: BULLET_SIZE,
        health: 10,
        damage: 10,
      })
    }
    trajectory.stage++
    if (trajectory.stage === 3) {
      trajectory.stage = 0
    }
  }

  onKey('space', (e) => !e.repeat && onClick())
  onPointer('down', onClick)

  sprite.money = 0
  sprite.getMoney = (amount) => (sprite.money += amount)
  let direction = -1
  return {
    sprite,
    trajectory,
    update() {
      sprite.update()
      trajectory.update()
      if (trajectory.stage === 0) return

      if (trajectory.stage === 1) {
        if (angle > MAX_ANGLE || angle < MIN_ANGLE) {
          direction = direction === -1 ? 1 : -1
        }
        updateTrajectory(angle + direction * 0.01, speed)
      } else if (trajectory.stage === 2) {
        if (speed > MAX_SPEED || speed < MIN_SPEED) {
          direction = direction === -1 ? 1 : -1
        }
        updateTrajectory(angle, speed + direction * 0.1)
      }
    },
    shutdown() {},
  }
}
