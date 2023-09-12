import { Text, track } from 'kontra'
import { LEVELS } from '../constants'
import { Circle, Path, Rect } from '../entities/bg'
import { playSound } from '../utils'

export const MapScene = ({ canvas, data, onNext }) => {
  const { width, height } = canvas
  const dots: any[] = []

  LEVELS.forEach((_, i) => {
    const o = width / LEVELS.length
    const y = _.y
    const dot = new Circle({
      x: _.x,
      y: y,
      size: 22,
      color:
        data.levelIndex === i
          ? '#000'
          : data.levelIndex + 1 === i
          ? '#f00'
          : data.levelIndex > i
          ? '#000'
          : '#0003',
      anchor: { x: 0.5, y: 0.5 },
    })

    const a = _.name.match(/ISK|MASH|KA/)
    const b = _.name.match(/ISK|TEH|MASH/)
    const text = Text({
      x: _.x,
      y: y + (a ? -20 : 20),
      text: _.name,
      color: '#000',
      font: 'bold 28px sans-serif',
      anchor: { x: b ? 0 : 0.5, y: a ? 1 : 0 },
    })
    dots.push(dot)
    dots.push(text)
  })

  const onNextLevel = () => {
    playSound('nextLevel')
    onNext()
  }

  const start = Text({
    x: width - 20,
    y: height - 20,
    text: 'Next',
    color: '#000',
    font: 'bold 42px sans-serif',
    anchor: { x: 1, y: 1 },
    onDown: onNextLevel,
  })
  track(start)

  const path = new Path()
  path.levelIndex = data.levelIndex

  const sky = new Rect(0, 0, canvas.width, canvas.height, [
    '#B68E72',
    '#B68E72',
  ])

  const lake = new Rect(
    -10,
    -10,
    canvas.width,
    canvas.height / 2,
    ['#0081AA', '#6AC4E0'],
    [
      'M138 90L0 44V-10L138 -3L168 44L175 71L138 90Z',
      'M536 52L489 47L486 28L493 -7L510 -10L541 -3L558 11L541 28L536 52Z',
      'M283 144L276 181L307 201L334 210L373 204V129L354 122L360 56L343 45V-3L381 -21H276L269 5L272 45L307 108L283 144Z',
      'M387.244 118.014L361.306 115.966L362.879 76.9976L378.987 74.6455L392.926 101.23L387.244 118.014Z',
      'M799 68L797 65L812 55L829 52L834 59L818 70L799 68Z',
    ],
  )
  return {
    shutdown() {},
    update() {},
    render() {
      sky.render()
      path.render()
      lake.render()
      dots.forEach((b) => b.render())
      start.render()
    },
  }
}
