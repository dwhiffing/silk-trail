import { Enemies } from '../entities/enemies'
import { Player } from '../entities/player'
import { Bullets } from '../entities/bullets'
import { checkCollisions } from '../utils'
import { Particles } from '../entities/particles'
import { emit, on, Text } from 'kontra'

export const RoadScene = ({ canvas, onNext, onWin, onLose }) => {
  const timers = {}

  const onPlayerDamaged = () => (hpText.text = `HP: ${player.sprite.health}`)
  const onDelay = (name: string, delay: number, fn: any) => {
    timers[name] = { fn, delay }
  }
  on('delay', onDelay)
  on('player-damaged', onPlayerDamaged)
  on('player-dead', onLose)

  let particles = Particles()
  let bullets = Bullets({ particles })
  let enemies = Enemies({ canvas, particles, bullets })
  let player = Player({ canvas, bullets, particles, enemies })
  const hpText = Text({
    x: 10,
    y: 15,
    text: `HP: ${player.sprite.health}`,
    color: '#fff',
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
    emit('delay', 'check', 10, () => {
      if (enemies.getRemaining() === 0) onNext()
    })
  }

  const nextLevel = () => {
    enemies.spawn(player.sprite, { type: 'homer', count: 3, rate: 250 })
    bullets.pool.clear()
  }
  nextLevel()

  return {
    nextLevel,
    shutdown() {
      enemies.pool.clear()
      bullets.pool.clear()
      player.shutdown()
    },
    update() {
      player.update()
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
      player.sprite.render()
      player.trajectory.render()
      enemies.pool.render()
      particles.pool.render()
      bullets.pool.render()
      hpText.render()
    },
  }
}
