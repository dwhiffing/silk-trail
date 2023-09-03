import { Enemies } from '../entities/enemies'
import { GROUND_Y, Player } from '../entities/player'
import { Minimap } from '../entities/minimap'
import { Bullets } from '../entities/bullets'
import { checkCollisions } from '../utils'
import { Particles } from '../entities/particles'
import { emit, on, Sprite, Text } from 'kontra'

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
  const level = {
    wave: { type: 'homer', count: 3, rate: 250 },
    totalLength: 1,
  }

  let particles = Particles()
  let bullets = Bullets({ particles })
  let enemies = Enemies({ canvas, particles, bullets })
  let player = Player({ canvas, data, bullets, particles, enemies })
  let map = new Minimap({
    canvas,
    maxProgress: level.totalLength,
    x: 80,
    y: 0,
    player,
  })
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
  }

  const nextLevel = () => {
    enemies.spawn(player.sprite, level.wave)
    bullets.pool.clear()
  }

  const groundLine = Sprite({
    x: 0,
    y: GROUND_Y - 30,
    width: canvas.width,
    height: 1,
    color: '#444',
    anchor: { x: 0, y: 0 },
  })

  const speedLine = Sprite({
    x: 0,
    y: 0,
    width: 1,
    height: GROUND_Y - 30,
    color: '#444',
    anchor: { x: 0, y: 0 },
  })

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
      map.update()
      speedLine.update()
      speedLine.dx = player.sprite.speed * -1
      if (speedLine.x < 0) speedLine.x = canvas.width
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
      speedLine.render()
      groundLine.render()
      player.sprite.render()
      map.render()
      player.trajectory.render()
      enemies.pool.render()
      particles.pool.render()
      bullets.pool.render()
      hpText.render()
    },
  }
}
