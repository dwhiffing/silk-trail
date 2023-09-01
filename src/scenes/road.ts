import { Enemies } from '../entities/enemies'
import { Player } from '../entities/player'
import { Bullets } from '../entities/bullets'
import { checkCollisions, distance, playSound, wrapNumber } from '../utils'
import { requestTimeout } from '../utils'
import { Particles } from '../entities/particles'
import { LEVELS } from '../constants'
import { angleToTarget, movePoint, randInt } from 'kontra'

export const RoadScene = ({ canvas, onNext, onWin, onLose }) => {
  let bullets = Bullets()
  let particles = Particles()
  let levelIndex = 0
  let endTriggered = false
  const nextLevel = () => {
    endTriggered = false
    player.sprite.health = 100
    let level = LEVELS[levelIndex]
    level.waves.forEach((wave) =>
      enemies.spawn(player.sprite, wave, wave.delay || 0),
    )
    bullets.pool.clear()
    levelIndex++
  }
  const x = canvas.width - 20
  const y = canvas.height / 2
  let enemies = Enemies({ canvas, particles, bullets })
  let player = Player({
    canvas,
    x,
    y,
    bullets,
    checkEnd: () => checkEnd(),
    enemies,
    onNext,
  })

  let interval
  const checkEnd = () => {
    if (interval) clearInterval(interval)

    interval = setInterval(() => {
      if (
        enemies.getRemaining() > 0 ||
        player.sprite.health <= 0 ||
        endTriggered
      )
        return
      endTriggered = true
      clearInterval(interval)
      requestTimeout(() => {
        let level = LEVELS[levelIndex]
        if (!level) return onWin(player.sprite.money)
        playSound('playerWin')
        bullets.pool.clear()
      }, 1000)
    }, 1000)
  }

  const playerEnemyCollide = (p, e) => {
    if (!p.isAlive()) return
    if (e.explodes || e.spikey) {
      const angle = wrapNumber(angleToTarget(p, e) + Math.PI, -Math.PI, Math.PI)
      const pos = movePoint({ x: p.dx, y: p.dy }, angle, 20)
      p.dx = pos.x
      p.dy = pos.y
      if (e.explodes) e.die()
      playSound('playerHit')
      p.takeDamage(e.damage)
    }
    checkEnd()

    if (!p.isAlive()) {
      playSound('playerDie')
      onLose()
    }
  }

  const bulletPlayerCollide = (b, p) => {
    b.die()
    playSound('playerHit')
    p.takeDamage(b.damage)

    if (!p.isAlive()) {
      playSound('playerDie')
      onLose()
    }
  }
  const bulletEnemyCollide = (b, e) => {
    if (b.triggered || b.isEnemyBullet) return
    // TODO: stat for mine explosion distance from player
    if (b.isMine && b.position.distance(player.sprite.position) < 100) return
    if (b.isMine) b.triggered = true
    // TODO: refactor
    setTimeout(() => {
      if (b.explodeRadius) {
        if (b.isMine) {
          b.die()
          playSound('mineExplode')

          particles.spawn({
            x: b.x,
            y: b.y,
            size: b.explodeRadius,
            opacity: 0.9,
            ttl: 40,
          })
          enemies.pool
            .getAliveObjects()
            .filter((e: any) => distance(e, b) < b.explodeRadius)
            .forEach((e: any) => e.takeDamage(b.damage))
        }
      } else {
        if (e.type !== 'absorber') {
          b.takeDamage(e.health)
          e.takeDamage(b.damage, true)
        } else {
          e.addCharge(b.health)
          b.die()
        }
      }
      checkEnd()
    }, b.triggerDuration)
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
      checkCollisions(
        bullets.pool.getAliveObjects().filter((b: any) => b.isEnemyBullet),
        [player.sprite],
        bulletPlayerCollide,
      )

      checkCollisions(
        [player.sprite],
        enemies.pool.getAliveObjects(),
        playerEnemyCollide,
      )
    },
    render() {
      bullets.pool.render()
      particles.pool.render()
      player.sprite.render()
      enemies.pool.render()
    },
  }
}
