import { Text, Sprite, track } from 'kontra'
import { playSound } from '../utils'
import { UPGRADES } from '../constants'

// TODO: refactor
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
    x: canvas.width - 50,
    y: canvas.height - 50,
    text: 'Next',
    color: 'white',
    font: '32px sans-serif',
    anchor: { x: 0.5, y: 0.5 },
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
