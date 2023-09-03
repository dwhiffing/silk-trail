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
    bullets.pool.clear()
  }
  let enemies = Enemies({ canvas, particles, bullets })
  let player = Player({ canvas, bullets, particles, enemies })

  const bulletPlayerCollide = (b, p) => {
    b.takeDamage(b.health)
    p.takeDamage(1)
    emit('player-damaged')
  }

  const bulletEnemyCollide = (b, e) => {
    b.takeDamage(b.health)
    e.takeDamage(b.damage, true)
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
      enemies.pool.clear()
      bullets.pool.clear()
      player.shutdown()
    },
    update() {
      player.update()
      enemies.update()
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
      if (enemies.getRemaining() === 0) onNext()
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
