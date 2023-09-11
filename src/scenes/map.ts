import { Text, Sprite, track } from 'kontra'
import { Circle, Path, Rect } from '../entities/bg'
import { playSound } from '../utils'
const yt = 5
const xt = 5

export const LEVELS = [
  {
    x: 50,
    y: 260,
    name: '1',
    totalLength: 0.25,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '2',
    x: 245,
    y: 400,
    totalLength: 0.5,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '3',
    x: 412,
    y: 330,
    totalLength: 1,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '4',
    x: 645,
    y: 325,
    totalLength: 1,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '5',
    x: 908,
    y: 380,
    totalLength: 1,
    waves: [{ type: 'normal', count: 1, progress: 0.5 }],
  },
  {
    name: '6',
    x: 1080,
    y: 195,
    totalLength: 1,
    waves: [
      { type: 'normal', count: 3, progress: 0.25 },
      { type: 'normal', count: 3, progress: 0.5 },
      { type: 'normal', count: 3, progress: 0.75 },
    ],
  },
]
export const MapScene = ({ canvas, data, onNext }) => {
  const { width, height } = canvas
  const dots: any[] = []

  LEVELS.forEach((_, i) => {
    const o = width / LEVELS.length
    const dot = new Circle({
      x: _.x,
      y: _.y,
      size: 22,
      color:
        data.levelIndex === i ? '#f00' : data.levelIndex > i ? '#000' : '#000',
      anchor: { x: 0.5, y: 0.5 },
    })

    dots.push(dot)
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

  const sky = new Rect(0, 0, canvas.width, canvas.height, [
    '#FFF893',
    '#FFE078',
  ])

  const lake = new Rect(
    -10,
    -10,
    canvas.width,
    canvas.height / 2,
    ['#D9FEFF', '#9EDFF7'],
    [
      'M138 90L0 44V-10L138 -3L168 44L175 71L138 90Z',
      'M536 52L489 47L486 28L493 -7L510 -10L541 -3L558 11L541 28L536 52Z',
      'M283 144L276 181L307 201L334 210L373 204V129L354 122L360 56L343 45V-3L381 -21H276L269 5L272 45L307 108L283 144Z',
      'M387.244 118.014L361.306 115.966L362.879 76.9976L378.987 74.6455L392.926 101.23L387.244 118.014Z',
      // 'M799 68L797 65L812 55L829 52L834 59L818 70L799 68Z',
    ],
  )

  return {
    shutdown() {},
    update() {},
    render() {
      sky.render()
      lake.render()
      path.render()
      dots.forEach((b) => b.render())
      start.render()
    },
  }
}
