import { Enemies } from '../entities/enemies'
import { Player } from '../entities/player'
import { Bullets } from '../entities/bullets'
import { checkCollisions } from '../utils'
import { Particles } from '../entities/particles'
import { emit, on, Text } from 'kontra'

export const RoadScene = ({ canvas, onNext, onWin, onLose }) => {
  let particles = Particles()
  let bullets = Bullets({ particles })
  let interval2
  const nextLevel = () => {
    enemies.spawn(player.sprite, { type: 'homer', count: 3, rate: 250 })
    if (interval2) clearInterval(interval2)
    interval2 = setInterval(() => {
      enemies.attack()
    }, 2000)
    bullets.pool.clear()
  }
  let enemies = Enemies({ canvas, particles, bullets })
  let player = Player({ canvas, bullets, particles, enemies })

  let interval
  const checkEnd = () => {
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
      if (enemies.getRemaining() > 0) return
      clearInterval(interval)
      onNext()
      // nextLevel()
    }, 1000)
  }

  const bulletPlayerCollide = (b, p) => {
    b.takeDamage(b.health)
    p.takeDamage(1)
    emit('player-damaged')
  }

  const bulletEnemyCollide = (b, e) => {
    b.takeDamage(b.health)
    e.takeDamage(b.damage, true)
    checkEnd()
  }

  const healthText = Text({
    x: 10,
    y: 15,
    text: `HP: ${player.sprite.health}`,
    color: '#fff',
    font: '16px sans-serif',
  })

  on('player-damaged', () => {
    healthText.text = `HP: ${player.sprite.health}`
  })

  on('player-dead', onLose)

  nextLevel()
  return {
    nextLevel,
    shutdown() {
      if (interval2) clearInterval(interval2)
      if (interval) clearInterval(interval)
      enemies.pool.clear()
      bullets.pool.clear()
      player.shutdown()
    },
    update() {
      player.update()
      enemies.pool.update()
      bullets.pool.update()
      particles.pool.update()
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
      healthText.render()
    },
  }
}
