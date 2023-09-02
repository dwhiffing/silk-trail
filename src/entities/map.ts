import { Text, Sprite, track } from 'kontra'
import { playSound } from '../utils'

export const Map = ({ canvas, onPurchase, onNext, getPlayer }) => {
  let active = true
  const background = Sprite({
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    color: '#555',
  })
  let buttons = []
  const start = Text({
    x: canvas.width - 10,
    y: canvas.height - 10,
    text: 'Next',
    color: 'white',
    font: '16px sans-serif',
    anchor: { x: 1, y: 1 },
    onDown() {
      active = false
      playSound('nextLevel')

      onNext()
    },
  })
  track(start)
  buttons.push(start)

  return {
    update() {
      if (!active) return
      background.update()
    },
    getActive() {
      return active
    },
    setActive(_active) {
      active = _active
    },
    render() {
      if (!active) return
      background.render()
      buttons.forEach((b) => b.render())
    },
  }
}
