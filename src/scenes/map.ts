import { Text, Sprite, track } from 'kontra'
import { playSound } from '../utils'
const yt = 5
const xt = 5

export const LEVELS = [
  {
    name: '1',
    totalLength: 0.25,
    waves: [{ type: 'normal', count: 1, progress: 0.25 }],
  },
  {
    name: '2',
    totalLength: 0.5,
    waves: [
      { type: 'normal', count: 3, progress: 0.25 },
      { type: 'normal', count: 3, progress: 0.5 },
      { type: 'normal', count: 3, progress: 0.75 },
    ],
  },
  {
    name: '3',
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
  const sh = height - yt * 2
  const sw = width - xt * 2
  const bg = Sprite({ x: 0, y: 0, width, height, color: '#eee' })
  const bg2 = Sprite({ x: xt, y: yt, width: sw, height: sh, color: '#95C08B' })
  const buttons: any[] = [bg, bg2]
  const dots: any[] = []

  LEVELS.forEach((_, i) => {
    const o = width / LEVELS.length
    const dot = Sprite({
      x: Math.floor(o / 2 + o * i),
      y: Math.floor(height / 2),
      width: 10,
      height: 10,
      color:
        data.levelIndex === i ? '#f00' : data.levelIndex > i ? '#ccc' : '#eee',
      anchor: { x: 0.5, y: 0.5 },
    })

    dots.push(dot)
  })

  const onNextLevel = () => {
    playSound('nextLevel')
    onNext()
  }
  const start = Text({
    x: width - 10,
    y: height - 10,
    text: 'Next',
    color: 'white',
    font: '16px sans-serif',
    anchor: { x: 1, y: 1 },
    onDown: onNextLevel,
  })
  track(start)
  buttons.push(start)

  return {
    shutdown() {},
    update() {},
    render() {
      buttons.forEach((b) => b.render())
      dots.forEach((b) => b.render())
    },
  }
}
