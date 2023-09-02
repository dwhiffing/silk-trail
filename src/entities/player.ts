import { onKey } from 'kontra'
import { PLAYER_STATS, UPGRADES, GRAVITY } from '../constants'
import { ShipSprite } from './sprite'
import { Trajectory } from './Trajectory'

interface PlayerUpgrades {
  mine_count?: number
  mine_damage?: number
  mine_speed?: number
  charge_speed?: number
  charge_max?: number
  shield?: number
  bullet_count?: number
}

const MIN_SPEED = 4
const MAX_SPEED = 10

const MIN_ANGLE = 3.7
const MAX_ANGLE = 4.4
const DEFAULT_ANGLE = 4

export const Player = ({
  canvas,
  x: originX,
  y: originY,
  bullets,
  particles,
  enemies,
}) => {
  const { maxCharge, size, health, shield, maxShield } = PLAYER_STATS
  let sprite = new ShipSprite({
    x: originX,
    y: originY,
    color: '#666',
    width: size / 2,
    height: size,
    health: health,
    maxHealth: health,
    charge: -2,
    maxCharge,
    mineDuration: 0,
    shield: shield,
    maxShield,
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
    y: sprite.y - size,
    // ddy: GRAVITY,
    angle: 0,
    speed: 0,
    // maxY: sprite.y,
    // particles,
  })
  const upgrades: PlayerUpgrades = {}
  UPGRADES.forEach((u) => {
    upgrades[u.key] = 0
  })

  sprite.isPlayer = true
  onKey('space', (e) => {
    if (e.repeat) return

    if (trajectory.stage === 0) {
      updateTrajectory(DEFAULT_ANGLE, MIN_SPEED)
    } else if (trajectory.stage === 1) {
    } else if (trajectory.stage === 2) {
      bullets.spawn({
        x: sprite.x,
        y: sprite.y - size,
        ddy: GRAVITY,
        angle,
        speed,
        size: 5,
        health: 10,
        damage: 10,
      })
    }
    trajectory.stage++
    if (trajectory.stage === 3) {
      trajectory.stage = 0
    }
  })

  sprite.money = 0
  sprite.getMoney = (amount) => (sprite.money += amount)
  let direction = -1
  return {
    sprite,
    trajectory,
    upgrades,
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
