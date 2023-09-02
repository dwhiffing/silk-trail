import { Enemies } from '../entities/enemies'
import { Player } from '../entities/player'
import { Bullets } from '../entities/bullets'
import { checkCollisions } from '../utils'
import { Particles } from '../entities/particles'

export const RoadScene = ({ canvas, onNext, onWin, onLose }) => {
  let particles = Particles()
  let bullets = Bullets({ particles })
  const nextLevel = () => {
    enemies.spawn(player.sprite, { type: 'homer', count: 3, rate: 500 })
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

  // const bulletPlayerCollide = (b, p) => {  }
  const bulletEnemyCollide = (b, e) => {
    b.takeDamage(b.health)
    e.takeDamage(b.damage, true)
    checkEnd()
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
      checkCollisions(
        bullets.pool.getAliveObjects(),
        enemies.pool.getAliveObjects(),
        bulletEnemyCollide,
      )
      // checkCollisions(
      //   bullets.pool.getAliveObjects().filter((b: any) => b.isEnemyBullet),
      //   [player.sprite],
      //   bulletPlayerCollide,
      // )
    },
    render() {
      bullets.pool.render()
      particles.pool.render()
      player.sprite.render()
      player.trajectory.render()
      enemies.pool.render()
    },
  }
}
