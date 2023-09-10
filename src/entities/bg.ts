import { GROUND_Y } from './player'
import { Sprite } from './sprite'

export const Background = ({ canvas, getSpeed }) => {
  const sky = new Rect(0, 0, canvas.width, canvas.height - 223, [
    '#0081AA',
    '#6AC4E0',
  ])

  const mountain = new Mountain(0, GROUND_Y - 129, canvas.width, 155)

  const groundLine = new Rect(
    0,
    GROUND_Y - 130,
    canvas.width,
    canvas.height - GROUND_Y + 130,
    ['#B78F73', '#8C6548'],
  )
  return {
    render() {
      sky.render()
      groundLine.render()
      mountain.render()
    },
    update() {
      mountain.update()
      mountain.dx = getSpeed() * -1
      if (mountain.x < -400) {
        mountain.x = canvas.width
        mountain.scaleX = Math.random() * 0.5 + 0.5
        mountain.scaleY = Math.random() * 0.5 + 0.2
      }
    },
    shutdown() {},
  }
}

export class Rect extends Sprite {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    colors: string[],
  ) {
    super({ x, y, width, height, anchor: { x: 0, y: 0 } })
    this.colors = colors
  }

  draw() {
    if (this.opacity === 0) return

    const gradient = this.context.createLinearGradient(
      0,
      0,
      0,
      this.height * 1.2,
    )
    this.colors.forEach((c, i) =>
      gradient.addColorStop(i / this.colors.length, c),
    )
    this.context.fillStyle = gradient
    this.context.beginPath()
    this.context.rect(0, 0, this.width, this.height)
    this.context.closePath()
    this.context.fill()
  }
}

export class Mountain extends Sprite {
  constructor(x: number, y: number, width: number, height: number) {
    super({ x, y, width, height, anchor: { x: 0, y: 1 } })
  }

  draw() {
    if (this.opacity === 0) return

    this.drawPath('M106 1L1 154H209L106 1Z', 'transparent', '#B78F73', 1)
  }
}
