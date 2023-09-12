import { Enemies } from '../entities/enemies'
import { Player } from '../entities/player'
import { Minimap } from '../entities/minimap'
import { Bullets } from '../entities/bullets'
import { checkCollisions } from '../utils'
import { Particles } from '../entities/particles'
import { emit, on, Text } from 'kontra'
import { LEVELS } from '../constants'
import { Background } from '../entities/bg'

export const RoadScene = ({ canvas, data, onNext, onWin, onLose }) => {
  const timers = {}

  const onPlayerDamaged = () => (hpText.text = `HP: ${player.sprite.health}`)
  const onDelay = (name: string, delay: number, fn: any) => {
    timers[name] = { fn, delay }
  }
  on('delay', onDelay)
  on('player-damaged', onPlayerDamaged)
  on('player-dead', onLose)
  on('level-end', onNext)
  const levelIndex = data.levelIndex
  const level = LEVELS[levelIndex]

  let particles = Particles()
  let bullets = Bullets({ particles })
  let enemies = Enemies({ canvas, level, particles, bullets })
  let player = Player({ canvas, data, bullets, particles, enemies })
  const background = Background({ canvas, getSpeed: () => player.sprite.speed })
  let map = new Minimap({
    canvas,
    maxProgress: level.totalLength,
    x: canvas.width / 10,
    y: 0,
    player,
    color: '#000',
  })
  const hpText = Text({
    x: 10,
    y: 15,
    text: `HP: ${player.sprite.health}`,
    color: '#000',
    font: '16px sans-serif',
  })

  const bulletPlayerCollide = (b, p) => {
    b.takeDamage(b.health)
    p.takeDamage(1)
    emit('player-damaged')
  }

  const bulletEnemyCollide = (b, e) => {
    b.takeDamage(b.health)
    e.takeDamage(b.damage, true)
  }

  return {
    shutdown() {
      enemies.pool.clear()
      bullets.pool.clear()
      player.shutdown()
    },
    update() {
      player.update()
      map.update()
      background.update()

      enemies.update(player)
      enemies.pool.update()
      bullets.pool.update()
      particles.pool.update()

      Object.keys(timers).forEach((key) => {
        if (timers[key].delay-- === 0) timers[key].fn()
      })

      checkCollisions(
        bullets.pool.getAliveObjects().filter((b: any) => !b.isEnemyBullet),
        enemies.pool.getAliveObjects(),
        bulletEnemyCollide,
      )
      checkCollisions(
        bullets.pool.getAliveObjects().filter((b: any) => b.isEnemyBullet),
        [player.sprite],
        bulletPlayerCollide,
      )
    },
    render() {
      background.render()
      player.sprite.render()
      map.render()
      enemies.pool.render()
      particles.pool.render()
      bullets.pool.render()
      player.trajectory.render()
      hpText.render()
    },
  }
}
